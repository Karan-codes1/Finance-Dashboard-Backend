import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/// register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(201).json({
      message: "User registered",
      user: userWithoutPassword
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

   
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json({
      token,
      user: userWithoutPassword
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};