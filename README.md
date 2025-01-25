# **AI-Powered NFT Minting with WhatsApp Integration**

## **Overview**

This project allows users to mint NFTs through WhatsApp by interacting with a chatbot. The chatbot collects user input, such as an art prompt, AI-generated content (AIGC) data, and a cryptographic proof. It then uses this information to mint a unique NFT on the Ethereum blockchain using the ERC-7007 standard for persistent on-chain storage.

The bot interacts with the user step-by-step, guiding them through the process of generating an NFT based on their input. The data collected is used to create the NFT, which is then minted and stored on the blockchain.

## **Features**

- **WhatsApp Chatbot**: Collects user input for NFT minting via WhatsApp.
- **AI-Generated Content (AIGC)**: Uses AI to generate unique art and metadata for NFTs.
- **ERC-7007**: Implements persistent on-chain storage for the generated NFT data.
- **Smart Contract**: Interacts with Ethereum blockchain to mint the NFT.
- **Twilio API**: Powers the WhatsApp bot interaction.
- **Web3 Integration**: Connects the backend to the Ethereum blockchain for minting NFTs.

## **Technologies Used**

- **Solidity**: Smart contract development for minting NFTs.
- **ERC-7007**: For persistent on-chain storage.
- **Node.js**: Backend server for handling WhatsApp messages and blockchain interactions.
- **Twilio API**: For WhatsApp bot integration.
- **Web3.js**: For interacting with the Ethereum blockchain.
- **Infura**: For connecting to the Ethereum network.
- **Express.js**: Backend framework to handle HTTP requests.

## **How It Works**

1. **User Interaction**:
   - The user sends a message to the WhatsApp bot (e.g., "Mint NFT").
   - The bot prompts the user for details such as the **art prompt**, **AIGC data** (AI-generated metadata), and **proof** (cryptographic signature).
   
2. **Smart Contract**:
   - Once all the details are collected, the backend calls a smart contract to mint the NFT.
   - The smart contract uses the ERC-7007 protocol to store the generated content and metadata on-chain, ensuring persistence.

3. **Minting Process**:
   - The NFT is minted with the user’s data and the transaction is sent to the Ethereum blockchain.
   - The bot sends the user a confirmation message with the transaction hash once the NFT is successfully minted.

## **Usage**

1. **Start the Minting Process**:
   - Send "Mint NFT" to the WhatsApp bot.
   - The bot will ask you for an **art prompt**, **AIGC data**, and **proof**.
   
2. **Provide the Details**:
   - Enter the prompt (e.g., "A futuristic city").
   - Enter any additional metadata or description for the NFT (e.g., "A city floating in the sky with neon lights").
   - Provide the cryptographic proof (e.g., a signature or verification key).
   
3. **NFT Minting**:
   - The bot will process the details and mint the NFT using the smart contract.
   - Once successful, the bot will send a confirmation message with the transaction hash.


## **Testing the Bot**

1. **Send "Mint NFT"** to the WhatsApp bot to start the process.
2. **Provide the necessary details** when prompted (prompt, AIGC data, proof).
3. **Wait for the bot to mint the NFT** and send a confirmation with the transaction hash.

## **Contributing**

If you'd like to contribute to this project, feel free to fork the repository and submit pull requests. You can also report issues or suggest features.

## **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

