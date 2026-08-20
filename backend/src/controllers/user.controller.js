import User from "../models/user.model.js";

// enable search via query params, e.g., /
export const getUser = async (req, res) => { 
    try {
        const { query } = req.query;
    const user = await User.findOne({ 
        username: { $regex: query.trim(), $options: "i" }, 
        _id: { $ne: req.user._id } 
    }).select("-password"); // Exclude the password field from the result
    
    console.log("User found:", user); // Log the user object to see if it was found
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const createUser = (req, res) => {
    console.log("User routeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    const { name, email } = req.body;
    res.status(200).json({ message: `Hello, ${name}!` });
};  