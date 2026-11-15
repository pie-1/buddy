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
    college: { type: String, default: "" },
    company: { type: String, default: "" },
    lookingFor: { type: String, default: "" },
    trustScore: { type: Number, default: 0 },

    // New profile fields
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
  return this.graduationYear <= new Date().getFullYear();
});

userSchema.virtual("isSpotlight").get(function () {
  return this.spotlightUntil && this.spotlightUntil > new Date();
});

userSchema.index({ university: 1, department: 1 });
userSchema.index({ name: "text", bio: "text", department: "text" });

const User = mongoose.model("User", userSchema);
export default User;