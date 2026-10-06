// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PracticalSubmission {
    address public professor;

    struct Student {
        string name;
        string enrollmentNo;
        bool   registered;
    }

    struct Submission {
        uint256 id;
        address student;     // wallet that submitted
        uint256 practicalNo;
        string  title;
        bytes32 fileHash;    // sha256 of the practical file (proof it was not changed later)
        uint256 timestamp;
        bool    verified;
    }

    mapping(address => Student)    private students;
    mapping(uint256 => Submission) public submissions;   // id => submission (ids start at 1)
    uint256 public totalSubmissions;

    event StudentRegistered(address indexed wallet, string name, string enrollmentNo);
    event Submitted(uint256 indexed id, address indexed student, uint256 practicalNo);
    event Verified(uint256 indexed id, address indexed by);

    modifier onlyProfessor() {
        require(msg.sender == professor, "not the professor");
        _;
    }

    modifier onlyRegisteredStudent() {
        require(students[msg.sender].registered, "not a registered student");
        _;
    }

    constructor() {
        professor = msg.sender;
    }

    // ---------- Professor: register students ----------
    function registerStudent(
        address wallet,
        string calldata name,
        string calldata enrollmentNo
    ) external onlyProfessor {
        require(!students[wallet].registered, "already registered");
        students[wallet] = Student(name, enrollmentNo, true);
        emit StudentRegistered(wallet, name, enrollmentNo);
    }

    // ---------- Anyone: check identity of a wallet ----------
    function getIdentity(address wallet)
        external view
        returns (string memory name, string memory enrollmentNo, bool registered)
    {
        Student memory s = students[wallet];
        return (s.name, s.enrollmentNo, s.registered);
    }

    // ---------- Student: submit a practical ----------
    function submitPractical(
        uint256 practicalNo,
        string calldata title,
        bytes32 fileHash
    ) external onlyRegisteredStudent {
        totalSubmissions += 1;
        uint256 id = totalSubmissions;
        submissions[id] = Submission(id, msg.sender, practicalNo, title, fileHash, block.timestamp, false);
        emit Submitted(id, msg.sender, practicalNo);
    }

    // ---------- Professor: see submission together with the student's identity ----------
    function getSubmission(uint256 id)
        external view
        returns (
            string memory studentName,
            string memory enrollmentNo,
            uint256 practicalNo,
            string memory title,
            bytes32 fileHash,
            uint256 timestamp,
            bool verified
        )
    {
        require(id >= 1 && id <= totalSubmissions, "no such submission");
        Submission memory s = submissions[id];
        Student memory st = students[s.student];
        return (st.name, st.enrollmentNo, s.practicalNo, s.title, s.fileHash, s.timestamp, s.verified);
    }

    // ---------- Professor: verify ----------
    function verify(uint256 id) external onlyProfessor {
        require(id >= 1 && id <= totalSubmissions, "no such submission");
        require(!submissions[id].verified, "already verified");
        submissions[id].verified = true;
        emit Verified(id, msg.sender);
    }
}
