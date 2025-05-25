const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
