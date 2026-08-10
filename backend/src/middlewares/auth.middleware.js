import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        if(!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = await User.findById(decoded.id).select("-password"); // Exclude password from the user object
            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }
         
    } else {
        return res.status(401).json({ message: "No token provided" });
    }
};