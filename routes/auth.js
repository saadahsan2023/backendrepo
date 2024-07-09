import express from "express";
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import fetchUser from "../middlewere/fatchUser.js";
const router = express.Router();

// Route 1 : Create a User using:POST "/api/auth/signup/". No Login required
router.post("/signup", async (req, res) => {
  // console.log(req.body);
  // const user = User(req.body);
  // user.save();
  // res.send(req.body);
  // data coming from body(frontend)
  const { name, email, password } = req.body;

  try {
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All field required" });
    }
    // Email Validation
    if (!email.includes("@")) {
      return res.status(400).json({ error: "Please Enter a Valide Email" });
    }
    // Fine a Unique User with email

    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ error: "user already exists" });
    }
    // Hash and salt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save Data into Database
    const newUser = await User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log(newUser);
    res.status(200).json({ success: "signup successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send("Internal Server Error");
  }
});
// Route 2 : Create a User login using:POST "/api/auth/login/". signup  required

router.post('/login', async (req, res) => {
  //* data comimg from body(frontend)
  const { email, password } = req.body

  try {
    //* Validation 
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" })
    }

    //* Email Validation 
    if (!email.includes("@")) {
      return res.status(400).json({ error: "Please enter a valid email" })
    }

    //* Find Unique User with email
    const user = await User.findOne({ email });

    console.log(user)

    //* if user not exists with that email
    if (!user) {
      res.status(400).json({ error: "User Not Found" })
    }

    //* matching user password to hash password with bcrypt.compare()
    const doMatch = await bcrypt.compare(password, user.password)
    console.log(doMatch)

    //* if match password then generate token 
    if (doMatch) {
      const token = jwt.sign({ userId: user.id }, "" + process.env.JWT_SECRET, {
        expiresIn: '7d'
      })

      res.status(201).json({ token, success: "Login successful" })
    }
    else {
      res.status(404).json({ error: 'Email And Password Not Found' })
    }

  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }


})
// Route 3 : Get LoggedIn User Detail Using:POST "/api/auth/getuser/". Login  required
router.get('/getuser', fetchUser, async (req, res) => {
  try {
    const userId = req.userId;
    console.log('getuser Id', userId);
    const user = await User.findById(userId).select("-password")
    res.send(user)

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error")

  }

})





export default router;









