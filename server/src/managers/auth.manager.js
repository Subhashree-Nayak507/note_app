import bcrypt from "bcryptjs";
import User from "../models/auth.model.js";

export const signupUser = async ({ username,  email, password }) => {
  if (!username || !email || !password) {
    throw new Error("All fields are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error("Username already taken");
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new Error("Email already taken");
  }

  const newUser = new User({ username, email, password });
  await newUser.save();
  
  return newUser; 
};

export const loginUser = async ({ username, password }) => {
  //console.log(username,password)
  if (!username || !password) {
    throw new Error("All fields are required");
  }
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("Invalid username");
  }

  // Verify password given to password stored in the database
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error("Invalid password");
  }

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
  };
}