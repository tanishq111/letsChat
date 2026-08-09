import express from "express";
import { getUser, createUser } from "../controllers/user.controller.js"; // importing the user controller


const router = express.Router(); // creating an instance of the express router

router.post("/", (req, res) => {
    console.log("User routeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
//   const { name, email } = req.body;
//   res.status(200).json({ message: `Hello, ${name}!` });
     createUser(req, res); // calling the createUser controller function
});

router.get("/", getUser);

router.get("/", (req, res) => {
    console.log("User routeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"); 
    getUser(req, res); // calling the getUser controller function
});

router.get("/boom", (req, res) => {
    throw new Error("Boom! This is a test error.");
});

router.get("/:id", (req, res) => {
    const { id } = req.params;
    res.status(200).json({ message: `User ID: ${id}` });
});

router.get("/id", (req, res) => {
    const { id } = req.body;
});


export default router; // router is an object that contains all the routes defined in this file. It is exported so that it can be used in other parts of the application, such as in the main server file (server.js).