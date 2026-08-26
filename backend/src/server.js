// import http from 'http';


// const server = http.createServer((req, res) => {
//      // we create a server object using the http module and pass a callback function that will be called every time a request is made to the server
  
//   console.log(`Request received:`, req.method, req.url);
//  // console.log('Response:', res);
//     if(req.url === '/favicon.ico') {
//     res.writeHead(204);
//     res.end();
//     return;
//   }
//   else if(req.url === '/about') {
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     res.end(`<html> 
//     <head><title>About</title></head>
//     <body>
//       <h1>About Page</h1>
//       <p>This is the about page of the server.</p>
//     </body>
//   </html>`);
//   }
//   else if(req.url === '/' && req.method === 'POST') {
//     console.log('Request body:', req.body);

//     let name = "";
//     req.on('data', (chunk) => {
//       name += chunk.toString();
//     });
//    console.log('Request body:', name);
//     req.on('end', () => {
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     res.end(`<html>
//     <head><title>Home</title></head>
//     <body>
//       <h1>Home Page</h1>
//       <p>This is the home page of the server. Hello, ${name}!</p>
//     </body>
//   </html>`);
//     });
//   }
//   else {
//     res.writeHead(404, { 'Content-Type': 'text/html' });
//     res.end(`<html>
//     <head><title>404 Not Found</title></head>
//     <body>
//       <h1>404 Not Found</h1>
//       <p>The page you are looking for does not exist.</p>
//     </body>
//   </html>`);
//   }
// });

// const PORT = 3000;  
// server.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });



import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js"; // importing the user routes
import authRoutes from "./routes/auth.routes.js"; // importing the auth routes
import errorHandler from "./middlewares/errorHandler.js"; // importing the error handling middleware
import dotenv from "dotenv";
import { connectDB } from "./config/db.js"; // importing the database connection function
import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");
import conversationRoutes from "./routes/conversation.route.js"; // importing the conversation routes
import userSearchRoutes from "./routes/user.search.routes.js"; // importing the user search routes
import messageRoutes from "./routes/messages.routes.js"; // importing the message routes

const app = express(); // creating an instance of the express application


dotenv.config(); // loading environment variables from .env file


app.use(express.json()); // middleware to parse incoming JSON requests // flagship feature of express -> middleware

app.use(cors({
  origin: "*", // allow requests from any origin
})); // middleware to enable CORS (Cross-Origin Resource Sharing) for all routes
app.use("/user", userRoutes); // using the user routes with a prefix of /api
app.use("/api/auth", authRoutes); // using the auth routes with a prefix of /api
app.use("/api/conversations", conversationRoutes); // using the conversation routes with a prefix of /api
app.use("/api/search", userSearchRoutes); // using the user search routes with a prefix of /api
app.use("/api/messages", messageRoutes); // using the message routes with a prefix of /api

// middleware to handle 404 errors (no route found errors)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler); // using the centralized error handling middleware
connectDB(); // connecting to the database
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});