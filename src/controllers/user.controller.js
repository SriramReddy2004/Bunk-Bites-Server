const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/user.model");
const { debugPrint } = require("../utils/debug");
const { sendMail } = require("../utils/sendMail");

const loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });
    if (user) {
      const savedPassword = user.password;
      console.log(savedPassword)
      const passwordMatched = await bcrypt.compare(password, savedPassword);
      if (passwordMatched) {
        const tokenBody = {
          userId: user._id,
          email: user.email,
          phone: user.phone,
          username: user.username,
          role: user.role,
        };
        const token = jwt.sign(tokenBody, process.env.JWT_SECRET, {
          expiresIn: 1296000, // 15 days in seconds
        });
        res.cookie("token", token, {
          maxAge: 1296000000, // 15 days in milliseconds,
          httpOnly: true,
          secure: process.env.MODE === "PRODUCTION",
          sameSite: process.env.MODE === "PRODUCTION" ? "strict" : "none",
        });
        res.set("token", token);
        return res
          .status(200)
          .json({ message: "Login successful", ...tokenBody });
      }
      return res.status(401).json({ message: "Invalid password" });
    }
    return res.status(404).json({ message: "User doesnot exist" });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error", error: e });
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, email, phone, password, role } = req.body;
    if (role === "admin") {
      return res
        .status(403)
        .json({ message: "You can't create an account directly as admin" });
    }
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS)
    );
    const tokenBody = {
      email,
      username,
      phone,
      password: hashedPassword,
      role,
    };
    const token = jwt.sign(tokenBody, process.env.JWT_SECRET, {
      expiresIn: 600,
    });
    const verificationUrl = `${process.env.SERVER_BASE_URL}/user/verify/${token}`;
    const emailBody = `
    <h2>Welcome to Bunk Bites 🍔</h2>
    <table cellpadding="10" cellspacing="0" style="font-family: Arial, sans-serif; font-size: 14px;">
        <tr>
        <td style="font-weight: bold;">Name:</td>
        <td>${username}</td>
        </tr>
        <tr>
        <td style="font-weight: bold;">Email:</td>
        <td>${email}</td>
        </tr>
        <tr>
        <td style="font-weight: bold;">Phone:</td>
        <td>${phone}</td>
        </tr>
    </table>
    <br>
    <p>You're just one step away from unlocking the best bites on campus! 🍟</p>
    <a href="${verificationUrl}" style="
        display: inline-block;
        padding: 12px 24px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        font-size: 16px;">
        Verify My Email
    </a>
    <br><br>
    <p style="font-size: 12px; color: #888;">This link will expire in 10 minutes.</p>
    `;

    if (await sendMail(email, "Verify your Bunk Bites account", emailBody)) {

      return res
        .status(200)
        .json({
          message:
            "Click on the link sent to your mail to confirm its you, link expires in 10 minutes",
        });
    }
    return res.status(400).json({ message: "Something went wrong" });
  } catch (e) {
    debugPrint(e);
    return res.status(500).json({ message: "Internal server error", error: e });
  }
};

const verifyUserRegistration = async (req, res) => {
  try {
    const { username, phone, email, password, role } = req.user;
    if (role === undefined) {
      const newUser = new User({ email, phone, password, username });
      await newUser.save();
      return res
        .status(201)
        .json({ message: "Account created successfully. Please login" });
    }
    const tokenBody = {
      email,
      username,
      phone,
      password,
      role,
    };
    const token = jwt.sign(tokenBody, process.env.JWT_SECRET, {
      expiresIn: 432000,
    });
    const adminEmail = process.env.ADMIN_EMAIL;
    const approvalUrl = `
        <h2>Vendor Approval Request</h2>
        <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
            <tr style="background-color: #f2f2f2;">
            <th align="left">Name</th>
            <td>${username}</td>
            </tr>
            <tr>
            <th align="left">Email</th>
            <td>${email}</td>
            </tr>
            <tr>
            <th align="left">Phone No</th>
            <td>${phone}</td>
            </tr>
        </table>
        <br>
        <a href="${process.env.SERVER_BASE_URL}/admin/approve/${token}" style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #28a745;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;">
            Review & Approve
        </a>
        `;


    if (await sendMail(adminEmail, "Approve vendor request", approvalUrl)) {
      return res
        .status(200)
        .json({
          message:
            "Your request has been submitted for admin approval and will be reviewed within 5 business days. You will be notified via email once your request is approved or denied. If you do not receive any communication within 5 days, your request will be considered rejected.",
        });
    }
    return res.status(400).json({ message: "Something went wrong" });
  } catch (e) {
    // debugPrint(e)
    if (e.code === 11000) {
      return res
        .status(409)
        .json({
          message: "User with same email or phone number already exist",
        });
    }
    return res.status(500).json({ message: "Internal server error", error: e });
  }
};

module.exports = { loginUser, registerUser, verifyUserRegistration };
