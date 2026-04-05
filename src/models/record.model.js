import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true  
  },
  amount: {
    type: Number,
    required: true,
    min: [0, "Amount cannot be negative"],
    max: [999999999, "Amount is too large"]
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    trim: true,
    maxlength: [500, "Note cannot exceed 500 characters"]
  }
}, { timestamps: true });

recordSchema.index({ user: 1, date: -1 }); // For faster queries by user and date

const Record = mongoose.model("Record", recordSchema);

export default Record;