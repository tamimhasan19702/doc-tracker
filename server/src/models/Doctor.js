import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    specialization: { type: String, trim: true, index: true },
    hospital: { type: String, trim: true, index: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
  },
  { timestamps: true }
);

doctorSchema.index({ createdAt: -1 });

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
