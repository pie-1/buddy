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
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: { type: String, required: true },
    university: { type: String, enum: ["TU", "PU", "PoU", "Admin"], required: true },
    graduationYear: {
      type: Number,
      required: function () { return this.role === "student"; },
      min: [2010, "Graduation year must be 2010 or later"],
      max: [2035, "Graduation year must be 2035 or earlier"],
      validate: {
        validator: function (v) {
          if (v === null || v === undefined) return true;
          return Number.isInteger(v);
        },
        message: "Graduation year must be a whole number",
      },
    },
    role: { type: String, enum: ["student", "moderator", "admin"], default: "student" },
    isVerified: { type: Boolean, default: false },
    college: { type: String, default: "" },
    company: { type: String, default: "" },
    lookingFor: { type: String, default: "" },
    trustScore: { type: Number, default: 0 },

    avatar: { type: String, default: null },
    bio: { type: String, default: "", maxlength: 500 },
    department: { type: String, default: "" },
    skills: [{ type: String, trim: true }],
    socials: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    currentProject: { type: String, default: "", maxlength: 200 },

    spotlightUntil: { type: Date, default: null },
    lastSeenAt: { type: Date, default: Date.now },

    otp: String,
    otpExpires: Date,

    likesReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likesGiven:    [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    profileBonusAwarded: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
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
  if (!this.graduationYear) return false;
  return this.graduationYear <= new Date().getFullYear();
});

userSchema.virtual("isSpotlight").get(function () {
  return this.spotlightUntil && this.spotlightUntil > new Date();
});

userSchema.index({ university: 1, department: 1 });
userSchema.index({ name: "text", bio: "text", department: "text" });

const User = mongoose.model("User", userSchema);
export default User;