/* eslint-disable */
const bcrypt = require("bcryptjs");
const { User, Session } = require("../models");
const { generateToken } = require("../utils");

const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Remove previous active session if exist
  await Session.findOneAndDelete({ userId: user._id });

  const token = generateToken(user._id, user.role);

  Session.create({ userId: user._id, token });

  return {
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      isVerified: user.isVerified,
    },
    token,
  };
};

const logout = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const session = await Session.findOne({ userId: user._id });
  if (!session) {
    throw new Error("Session not found");
  }

  const result = await Session.findOneAndDelete({ userId: user._id });

  return {
    success: true,
    message: "Logout success",
  };
};

module.exports = {
  authenticateUser,
  logout,
};
