import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Configure transporter
  console.log("Environment variable GMAIL_APP_PASSWORD:", process.env.GMAIL_APP_PASSWORD ? "Found" : "Not found");
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "Oueslati.sofienne3@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    console.log("Attempting to send email with data:", { name, email, subject, message });
    
    // Test the transporter connection first
    await transporter.verify();
    console.log("Transporter connection verified");
    
    const info = await transporter.sendMail({
      from: 'Portfolio Contact <Oueslati.sofienne3@gmail.com>',
      to: "Oueslati.sofienne3@gmail.com",
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });
    
    console.log("Email sent successfully:", info.messageId);
    res.status(200).json({ message: "Email sent successfully", messageId: info.messageId });
  } catch (error) {
    console.error("Email sending failed:", error);
    
    // Provide more specific error messages
    let errorMessage = "Failed to send email";
    if (error.code === 'EAUTH') {
      errorMessage = "Authentication failed. Please check your Gmail App Password.";
    } else if (error.code === 'ECONNECTION') {
      errorMessage = "Connection failed. Please check your internet connection.";
    } else if (error.message.includes('User')) {
      errorMessage = "Gmail authentication failed. Please verify your App Password.";
    }
    
    res.status(500).json({ error: errorMessage, details: error.message });
  }
}
