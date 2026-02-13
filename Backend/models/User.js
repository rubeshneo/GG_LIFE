import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    code: { type: String },
    codeExpiry: { type: Date },

    resetCode: { type: String },
    resetCodeExpiry: { type: Date },

    wrongAttempts: {
      type: Number,
      default: 0
    },
    isLocked: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }

  },
  { timestamps: true }
);
const User = mongoose.model("User", UserSchema);
export default User;
