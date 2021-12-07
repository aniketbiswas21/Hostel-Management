const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ComplaintsSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaints", ComplaintsSchema);
