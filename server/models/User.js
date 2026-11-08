// server/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          const validDomains = /@([a-zA-Z0-9-]+\.)*(tu\.edu\.np|pu\.edu\.np|pokharauniversity\.edu\.np|acme\.edu\.np)$/;
          return validDomains.test(v);
        },
        message: (props) => `${props.value} is not a valid university email.`,
      },
    },
    password: { type: String, required: true },
    university: { type: String, enum: ["TU", "PU", "PoU"], required: true },
    graduationYear: { type: Number, required: true },
    role: { type: String, enum: ["student", "moderator", "admin"], default: "student" },
    isVerified: { type: Boolean, default: false },
    trustScore: { type: Number, default: 0 },
    otp: String,
    otpExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.virtual("isAlumni").get(function () {
  return this.graduationYear <= new Date().getFullYear();
});

const User = mongoose.model("User", userSchema);
export default User;