# ChatAIGCNFT Smart Contract

This is a smart contract for a non-fungible token (NFT) project called **ChatAIGCNFT**. It integrates the ERC721 standard and extends it with additional functionality to manage and verify AI-generated content (AIGC) data.

## Overview

The **ChatAIGCNFT** contract allows minting NFTs that store AI-generated content, including prompts, AI-generated data, and proof. It also includes the ability to verify the authenticity of the data through a signature.

The contract implements the **IERC7007** interface, which defines the events and methods for handling AI-generated content associated with NFTs. The contract is designed for use by the owner (typically the creator or admin of the platform) to mint and update NFTs with new AIGC data.

## Features

- **Minting NFTs**: The contract allows the owner to mint new NFTs and associate them with AI-generated content (AIGC), including the prompt, generated data, and proof (signature).
- **Adding AIGC Data**: The owner can update the AIGC data for an existing NFT.
- **Verifying AIGC Data**: A method to verify the authenticity of AI-generated data using a cryptographic signature.
- **Event Emission**: The contract emits an event `AigcData` whenever new AIGC data is added to a token, providing transparency and traceability.

## Smart Contract Details

### Contract Name
`ChatAIGCNFT`

### Inherited Contracts
- `ERC721`: Standard implementation for non-fungible tokens.
- `Ownable`: Provides ownership control, ensuring only the owner can mint and update NFTs.
- `IERC7007`: Custom interface for managing and verifying AI-generated content associated with NFTs.
- `ERC165`: Standard interface for checking support for other interfaces.

### Key Functions

1. **mintNFT(address to, bytes calldata prompt, bytes calldata aigcData, bytes calldata proof)**  
   Mints a new NFT and associates it with AI-generated content (prompt, data, and proof). This function can only be called by the contract owner.

2. **addAigcData(uint256 tokenId, bytes calldata prompt, bytes calldata aigcData, bytes calldata proof)**  
   Allows the contract owner to update the AIGC data for an existing NFT. This function takes the token ID, the new prompt, AI-generated data, and proof (signature).

3. **verify(bytes calldata prompt, bytes calldata aigcData, bytes calldata proof)**  
   Verifies the authenticity of the AI-generated data by recovering the signer's address from the cryptographic proof (signature). Returns `true` if the signature is valid, otherwise `false`.

4. **supportsInterface(bytes4 interfaceId)**  
   Checks if the contract supports a given interface. It supports both the ERC721 interface and the custom IERC7007 interface.

### Events

- **AigcData(uint256 indexed tokenId, bytes indexed prompt, bytes indexed aigcData, bytes proof)**  
  Emitted when new AI-generated content is added to an NFT, either during minting or updating the data.

## Installation

To deploy and interact with this contract, you'll need the following:

- **Solidity version**: ^0.8.18
- **OpenZeppelin Contracts**: This contract uses the following OpenZeppelin contracts:
  - `ERC721`
  - `Ownable`
  - `ECDSA`
  - `ERC165`
  
You can install OpenZeppelin contracts via npm:

```bash
npm install @openzeppelin/contracts
```

## Usage

1. **Deploying the Contract**:  
   Deploy the `ChatAIGCNFT` contract to the Ethereum network (or a compatible blockchain).

2. **Adding AIGC Data**:  
   The owner can call the `addAigcData` function to update the AIGC data for an existing NFT.

3. **Minting NFTs**:  
   Use the `mintNFT` function to mint NFTs and associate them with AI-generated content. The contract owner provides the `prompt`, `aigcData`, and `proof` (signature) as arguments.

4. **Verifying AIGC Data**:  
   Anyone can call the `verify` function to verify the authenticity of the AI-generated data associated with a token.

## Deployed and Verified Contract

The **ChatAIGCNFT** contract has been deployed and verified on the **Sepolia testnet**.

- **Contract Address**: [0xAC99583EE8ae7BfCda7D43657F6a4c0c0Da7E0B8](https://base-sepolia.blockscout.com/address/0xAC99583EE8ae7BfCda7D43657F6a4c0c0Da7E0B8)

You can interact with the contract and view its details using the provided link.

## Example

### Minting an NFT with AI-Generated Content

```solidity
// Example: Minting a new NFT
chatAIGCNFT.mintNFT(
    toAddress,  // Address to mint the NFT to
    prompt,     // The prompt that generated the AIGC data
    aigcData,   // The AI-generated data
    proof       // The cryptographic proof (signature) of the data
);
```

### Verifying AIGC Data

```solidity
// Example: Verifying AIGC data
bool isValid = chatAIGCNFT.verify(prompt, aigcData, proof);
```

## Security Considerations

- The contract is designed with the assumption that only the owner can mint and modify NFTs. Ensure that the owner's private key is kept secure.
- When adding AIGC data, it is important to ensure that the proof (signature) is valid to maintain the integrity of the data.

## License

This project is licensed under the MIT License.

