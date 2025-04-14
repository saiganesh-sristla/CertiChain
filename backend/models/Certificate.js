import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema(
  {
    hash: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Certificate", CertificateSchema);