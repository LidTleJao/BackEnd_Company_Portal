import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    keycloakId: { type: String, required: true, unique: true },
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    phone: String,
    nationalIdEncrypted: String,
    nationalIdLast4: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export { User, User as userModel };
