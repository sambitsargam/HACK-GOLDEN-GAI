import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import express from 'express';
import twilio from "twilio";
import { ethers } from "ethers";  // Added ethers.js for blockchain interaction

dotenv.config();

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const WALLET_DATA_FILE = "wallet_data.txt";
const INFURA_URL = process.env.INFURA_URL;  // Add your Infura endpoint here

// Ethereum setup
const provider = new ethers.JsonRpcProvider(INFURA_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = "0xAC99583EE8ae7BfCda7D43657F6a4c0c0Da7E0B8";  // Replace with deployed contract address
const contractABI = [
  "function mintNFT(address to, uint256 tokenId, string memory uri) public",
  "function tokenURI(uint256 tokenId) public view returns (string memory)"
];
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Validate Environment Variables
function validateEnvironment(): void {
  const missingVars: string[] = [];
  const requiredVars = ["CDP_API_KEY_NAME", "CDP_API_KEY_PRIVATE_KEY", "TWILIO_PHONE_NUMBER", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "INFURA_URL", "PRIVATE_KEY"];
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error("Error: Required environment variables are not set");
    missingVars.forEach(varName => {
      console.error(`${varName}=your_${varName.toLowerCase()}_here`);
    });
    process.exit(1);
  }
}

// Validate the environment
validateEnvironment();

// Initialize the agent
async function initializeAgent() {
  try {
    const llm = new ChatOpenAI({
      apiKey: "gaia",
      model: "llama",
      configuration: {
        baseURL: "https://llamatool.us.gaianet.network/v1",
      },
    });

    let walletDataStr: string | null = null;
    if (fs.existsSync(WALLET_DATA_FILE)) {
      walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
    }

    const config = {
      cdpWalletData: walletDataStr || undefined,
      networkId: process.env.NETWORK_ID || "base-sepolia",
    };

    const agentkit = await CdpAgentkit.configureWithWallet(config);
    const cdpToolkit = new CdpToolkit(agentkit);
    const tools = cdpToolkit.getTools();
    const memory = new MemorySaver();
    const agentConfig = { configurable: { thread_id: "CDP AgentKit Chatbot Example!" } };

    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `You are a helpful agent that can interact on-chain using the Coinbase Developer Platform AgentKit.`,
    });

    const exportedWallet = await agentkit.exportWallet();
    fs.writeFileSync(WALLET_DATA_FILE, exportedWallet);

    return { agent, config: agentConfig };
  } catch (error) {
    console.error("Failed to initialize agent:");
    throw error;
  }
}

// Generate agent response and mint NFT
async function getAgentResponseAndMintNFT(incomingMsg: string) {
  const { agent, config } = await initializeAgent();

  const stream = await agent.stream({ messages: [new HumanMessage(incomingMsg)] }, config);
  let agentResponse = "";

  for await (const chunk of stream) {
    if ("agent" in chunk) {
      agentResponse = chunk.agent.messages[0].content;
    } else if ("tools" in chunk) {
      agentResponse = chunk.tools.messages[0].content;
    }
  }

  // Mint the NFT with the AI-generated content as metadata
  const tokenId = Date.now();  // Unique token ID based on timestamp
  const metadata = agentResponse;  // Use the AI response as metadata

  const tx = await contract.mintNFT(wallet.address, tokenId, metadata);
  console.log("Minted NFT with transaction hash:", tx.hash);

  return agentResponse;
}

// Send WhatsApp message
async function sendWhatsAppMessage(agentResponse: string, from: string) {
  await client.messages.create({
    body: agentResponse,
    from: `whatsapp:+14155238886`,  // Your Twilio WhatsApp sandbox number
    to: `${from}`,  // Ensure to prefix the incoming number with "whatsapp:"
  });

  console.log("WhatsApp message sent successfully:", agentResponse);
}

// Send SMS message
async function sendSMSMessage(agentResponse: string, from: string) {
  await client.messages.create({
    body: agentResponse,
    from: TWILIO_PHONE_NUMBER,  // Your Twilio phone number
    to: from,
  });

  console.log("SMS message sent successfully:", agentResponse);
}

// Set up the webhook to receive incoming messages
const app = express();
const port = process.env.PORT || 3000;

// Parse incoming request data
app.use(express.urlencoded({ extended: false }));

// Route to handle incoming SMS
app.post("/sms", async (req, res) => {
  const from = req.body.From;
  const body = req.body.Body;

  console.log(`Received SMS message from ${from}: ${body}`);

  try {
    const agentResponse = await getAgentResponseAndMintNFT(body);
    await sendSMSMessage(agentResponse, from);
    res.status(200).send("<Response></Response>");
  } catch (error) {
    console.error("Error handling SMS:", error);
    res.status(500).send("<Response></Response>");
  }
});

// Route to handle incoming WhatsApp messages
app.post("/whatsapp", async (req, res) => {
  const from = req.body.From;
  const body = req.body.Body;

  console.log(`Received WhatsApp message from ${from}: ${body}`);

  try {
    const agentResponse = await getAgentResponseAndMintNFT(body);
    await sendWhatsAppMessage(agentResponse, from);
    res.status(200).send("<Response></Response>");
  } catch (error) {
    console.error("Error handling WhatsApp:", error);
    res.status(500).send("<Response></Response>");
  }
});

app.listen(port, () => {
  console.log(`Listening for messages on port ${port}`);
});
