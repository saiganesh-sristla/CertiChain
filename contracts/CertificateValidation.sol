// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract CertificateValidation {
    address public admin;

    enum Role { NGO, Verifier }

    struct User {
        address userAddress;
        Role role;
    }

    struct Certificate {
        string ipfsHash;
        bool isValid;
    }

    mapping(address => User) public users;
    mapping(string => Certificate) public certificates;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyNGO() {
        require(users[msg.sender].role == Role.NGO, "Only NGO can store certificates");
        _;
    }

    function addUser(address _user, Role _role) external onlyAdmin {
        users[_user] = User(_user, _role);
    }

    function storeCertificate(string memory _certificateHash, string memory _ipfsHash) external onlyNGO {
        certificates[_certificateHash] = Certificate(_ipfsHash, true);
    }

    function verifyCertificate(string memory _certificateHash) external view returns (bool, string memory) {
        Certificate memory cert = certificates[_certificateHash];
        return (cert.isValid, cert.ipfsHash);
    }
}
