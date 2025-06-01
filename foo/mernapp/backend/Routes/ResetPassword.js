const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { generateOTP, sendOTPEmail } = require('../utils/otpGenerator');

// 1. Request OTP
router.post('/reset-password/request-otp', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Generate and save OTP
    const otp = generateOTP();
    const newOTP = new OTP({
      email,
      otp
    });

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    // Save new OTP
    await newOTP.save();

    // Send OTP to email
    const sent = await sendOTPEmail(email, otp);
    if (!sent) {
      return res.status(500).json({ success: false, error: 'Failed to send OTP' });
    }

    res.json({ success: true, message: 'OTP has been sent to your email' });
  } catch (error) {
    console.error('Error in request-otp:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// 2. Verify OTP
router.post('/reset-password/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find and validate OTP
    const storedOTP = await OTP.findOne({ email });
    if (!storedOTP || storedOTP.otp !== otp) {
      return res.status(400).json({ success: false, error: 'Invalid OTP' });
    }

    // Delete the used OTP
    await OTP.deleteOne({ email });

    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error in verify-otp:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// 3. Reset Password
router.post('/reset-password/reset', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error in reset-password:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;