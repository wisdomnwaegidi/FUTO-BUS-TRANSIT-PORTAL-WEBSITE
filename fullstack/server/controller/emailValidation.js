// code 1
/* When a user signs up, generate a confirmation token and store it in your database along with the user's email address. */
const token = crypto.randomBytes(20).toString("hex");
const user = new User({ email: req.body.email, confirmation_token: token });
await user.save();

// Send a confirmation email to the user's email address
const transporter1 = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailOptions1 = {
  from: "no-reply@example.com",
  to: req.body.email,
  subject: "Confirm your email address",
  text: `Please click the following link to confirm your email address: http://${req.headers.host}/confirmation/${req.body.email}/${token}`,
};

await transporter.sendMail(mailOptions);

// code 2
/* Use Nodemailer to send a confirmation email to the user's email address. 
The email should contain a link to the confirmation route in your app, along with the confirmation token. */

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailOptions = {
  from: "no-reply@example.com",
  to: req.body.email,
  subject: "Confirm your email address",
  text: `Please click the following link to confirm your email address: http://${req.headers.host}/confirmation/${req.body.email}/${token}`,
};

await transporter.sendMail(mailOptions);
