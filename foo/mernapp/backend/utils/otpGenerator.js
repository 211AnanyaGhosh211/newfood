const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create a transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset OTP',
    html: `
      <h3>Password Reset OTP</h3>
      <p>Your one-time password (OTP) for resetting your password is: <strong>${otp}</strong></p>
      <p>This OTP is valid for 10 minutes.</p>
      <p>Please do not share this OTP with anyone.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail
};
