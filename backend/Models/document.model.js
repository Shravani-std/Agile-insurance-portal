const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    documentType: {
      type: String,
      enum: [
        "Aadhar",
        "PAN",
        "Driving License",
        "Passport",
        "Policy",
        "Claim",
        "Other",
      ],
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: Number,

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "Re-upload Requested",
      ],
      default: "Pending",
    },

    note: {
      type: String,
      default: "",
    },
    marks: {
      type: [
        {
          id: { type: String, required: true },
          tool: { type: String, enum: ["pen", "circle"], required: true },
          color: { type: String, required: true },
          points: [
            {
              x: { type: Number, required: true },
              y: { type: Number, required: true },
              _id: false,
            },
          ],
          _id: false,
        },
      ],
      default: [],
    },
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Document", documentSchema);