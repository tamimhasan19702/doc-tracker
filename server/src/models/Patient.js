import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    age: { type: Number, min: 0, max: 150 },
    gender: { type: String, enum: ["male", "female", "other"] },
    condition: { type: String, trim: true, index: true },
    phone: { type: String, trim: true },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Hot query: patients of a doctor ordered by recency.
patientSchema.index({ doctor: 1, createdAt: -1 });
patientSchema.index({ createdAt: -1 });

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
