import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Store uploaded files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max limit
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "BlockProof IPFS Service" });
});

// Upload endpoint
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const jwt = process.env.PINATA_JWT;
    if (!jwt) {
      return res.status(500).json({ error: "Pinata JWT is not configured on the server" });
    }

    // Build FormData for Pinata API
    const formData = new FormData();
    const fileBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
    formData.append("file", fileBlob, req.file.originalname);

    // Optional metadata
    const metadata = JSON.stringify({
      name: req.file.originalname,
      keyvalues: {
        app: "BlockProof",
        uploadedAt: new Date().toISOString(),
      },
    });
    formData.append("pinataMetadata", metadata);

    // Pin file to IPFS
    const pinataRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    });

    if (!pinataRes.ok) {
      const errorText = await pinataRes.text();
      console.error("Pinata error response:", errorText);
      return res.status(pinataRes.status).json({
        error: "Failed to upload to IPFS via Pinata",
        details: errorText,
      });
    }

    const data = await pinataRes.json();
    const ipfsHash = data.IpfsHash;

    console.log(`[IPFS] Successfully pinned ${req.file.originalname} -> CID: ${ipfsHash}`);

    return res.json({
      success: true,
      ipfsHash,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`BlockProof IPFS backend running on http://localhost:${PORT}`);
});
