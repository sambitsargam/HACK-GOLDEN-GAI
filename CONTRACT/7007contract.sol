// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

interface IERC7007 is IERC165 {
    event AigcData(uint256 indexed tokenId, bytes indexed prompt, bytes indexed aigcData, bytes proof);

    function addAigcData(
        uint256 tokenId,
        bytes calldata prompt,
        bytes calldata aigcData,
        bytes calldata proof
    ) external;

    function verify(
        bytes calldata prompt,
        bytes calldata aigcData,
        bytes calldata proof
    ) external view returns (bool success);
}

contract ChatAIGCNFT is ERC721, IERC7007, Ownable {
    using ECDSA for bytes32;

    struct AigcContent {
        bytes prompt;
        bytes aigcData;
        bytes proof;
    }

    mapping(uint256 => AigcContent) private _aigcContents;

    uint256 private _tokenCounter;

    constructor() ERC721("ChatAIGCNFT", "CAI") {}

    function mintNFT(address to, bytes calldata prompt, bytes calldata aigcData, bytes calldata proof) external onlyOwner {
        uint256 tokenId = _tokenCounter++;
        _mint(to, tokenId);
        _aigcContents[tokenId] = AigcContent(prompt, aigcData, proof);
        emit AigcData(tokenId, prompt, aigcData, proof);
    }

    function addAigcData(
        uint256 tokenId,
        bytes calldata prompt,
        bytes calldata aigcData,
        bytes calldata proof
    ) external override onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        _aigcContents[tokenId] = AigcContent(prompt, aigcData, proof);
        emit AigcData(tokenId, prompt, aigcData, proof);
    }

    
    function verify(
        bytes calldata prompt,
        bytes calldata aigcData,
        bytes calldata proof
    ) external view override returns (bool success) {
        // Create a hash of the data to be signed
        bytes32 hash = keccak256(abi.encodePacked(prompt, aigcData));

        // Recover the signer from the proof (signature)
        address signer = ECDSA.recover(hash, proof);

        // Return whether the signer is a valid address
        return signer != address(0);
    }


    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, IERC165) returns (bool) {
        return
            interfaceId == type(IERC7007).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
