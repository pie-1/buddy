// server/controllers/authController.js
import User from "../models/User.js";
import CollegeRequest from "../models/CollegeRequest.js";
import generateToken from "../utils/generateToken.js";
import { sendOTPEmail } from "../utils/sendEmail.js";

const registerUser = async (req, res) => {
  const { name, email, password, graduationYear, role, adminCode } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const isAdminRequest = role === "admin" || role === "moderator";
    const isValidAdminCode = isAdminRequest && adminCode === process.env.ADMIN_INVITE_CODE;

    if (isAdminRequest && !isValidAdminCode) {
      return res.status(403).json({ message: "Invalid Admin Invite Code. Access denied." });
    }

    let university = "Admin";
    let finalGradYear;

    // Students go through strict validation
    if (!isValidAdminCode) {
      const domain = email.split("@")[1].toLowerCase();

      if (domain.endsWith("tu.edu.np") || domain.includes("ioe.edu.np") || domain.includes("acme.edu.np")) {
        university = "TU";
      } else if (domain.endsWith("pu.edu.np")) {
        university = "PU";
      } else if (domain.endsWith("pokharauniversity.edu.np")) {
        university = "PoU";
      } else {
        const approvedRequest = await CollegeRequest.findOne({ domain, status: "approved" });
        if (approvedRequest) {
          university = "TU";
        } else {
          return res.status(400).json({ 
            message: "Please use a valid university email domain, or request your college domain in the footer." 
          });
        }
      }

      const currentYear = new Date().getFullYear();
      finalGradYear = Number(graduationYear);
      if (!finalGradYear || finalGradYear < 2010 || finalGradYear > currentYear + 8) {
        return res.status(400).json({ message: "Please enter a valid graduation year." });
      }
    }

    const assignedRole = isValidAdminCode ? role : "student";

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password,
      university,
      // Only include graduationYear for students. For admins, it's undefined.
      ...(finalGradYear !== undefined && { graduationYear: finalGradYear }),
      role: assignedRole,
      otp,
      otpExpires,
    });

    if (user) {
      if (process.env.NODE_ENV === "development") {
        console.log(`[DEV] OTP for ${email}: ${otp}`);
      } else {
        await sendOTPEmail(email, otp).catch((err) => console.error("Email error:", err));
      }
      res.status(201).json({ message: "Registration successful.", email: user.email });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        return res.status(401).json({ message: "Please verify your email first" });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        role: user.role,
        isAlumni: user.isAlumni,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      university: user.university,
      role: user.role,
      isAlumni: user.isAlumni,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { registerUser, verifyOTP, loginUser };