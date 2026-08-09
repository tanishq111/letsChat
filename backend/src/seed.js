import { configDotenv } from "dotenv";
import {connectDB} from "./config/db.js";
import User from "./models/user.model.js";

configDotenv();
import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");


const seedData = async () => {
  try {
    await connectDB(); // Connect to the database

      const users = await User.create([
    { username: "Aisha", email: "aisha@test.com", password: "temp123" },
    { username: "Rahul", email: "rahul@test.com", password: "temp123" },
    { username: "Sara",  email: "sara@test.com",  password: "temp123" },
  ]);

  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

seedData();
