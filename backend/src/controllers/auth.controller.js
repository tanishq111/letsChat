import User from "../models/user.model.js";
import { generateToken } from "../utils/tokenhelper.js";

 const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
 
     if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = new User({ username, email, password }); // creating a user based on the user model schema defined in user.model.js
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" ,
        "User": {
            "username": newUser.username,
            "email": newUser.email,
            "id": newUser._id
        }
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


 const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(user);
    res.status(200).json({ message: "User logged in successfully",
        "User": {
            "username": user.username,
            "email": user.email,
            "id": user._id,
            "token": token
        }
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMe = async (req, res) => {
    try {
        const user = req.user; 
        // Assuming the user is attached to the request object by the authentication middleware  
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export  { registerUser, loginUser, getMe };