import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    phone: String,
    relation: String,
    isPrimary: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
