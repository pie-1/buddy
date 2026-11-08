// server/controllers/authController.js
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendOTPEmail } from "../utils/sendEmail.js";

const registerUser = async (req, res) => {
  const { name, email, password, graduationYear } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Smart University Detection
    let university = "";
    const domain = email.split("@")[1].toLowerCase();
    
    if (domain.endsWith("tu.edu.np") || domain.includes("ioe.edu.np") || domain.includes("acme.edu.np")) {
      university = "TU";
    } else if (domain.endsWith("pu.edu.np")) {
      university = "PU";
    } else if (domain.endsWith("pokharauniversity.edu.np")) {
      university = "PoU";
    } else {
      return res.status(400).json({ message: "Please use a valid university email domain." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password,
      university,
      graduationYear,
      otp,
      otpExpires,
    });

    if (user) {
      if (process.env.NODE_ENV === "development") {
        console.log(`[DEV] OTP for ${email}: ${otp}`);
      } else {
        await sendOTPEmail(email, otp);
      }

      res.status(201).json({
        message: "Registration successful. Please verify your email.",
        email: user.email,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

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

export { registerUser, verifyOTP, loginUser };