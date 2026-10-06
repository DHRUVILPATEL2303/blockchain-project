// Human-readable ABI (ethers v6).
export const ABI = [
  "function professor() view returns (address)",
  "function totalSubmissions() view returns (uint256)",
  "function registerStudent(address wallet, string name, string enrollmentNo)",
  "function getIdentity(address wallet) view returns (string name, string enrollmentNo, bool registered)",
  "function submitPractical(uint256 practicalNo, string title, string ipfsHash, bytes32 fileHash)",
  "function getSubmission(uint256 id) view returns (string studentName, string enrollmentNo, uint256 practicalNo, string title, string ipfsHash, bytes32 fileHash, uint256 timestamp, bool verified)",
  "function verify(uint256 id)",
];
