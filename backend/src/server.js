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


// is typing indicator feature for the chat application
// arrange the code


import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io"; // importing the socket.io server class
import userRoutes from "./routes/user.routes.js"; // importing the user routes
import authRoutes from "./routes/auth.routes.js"; // importing the auth routes
import errorHandler from "./middlewares/errorHandler.js"; // importing the error handling middleware
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { connectDB } from "./config/db.js"; // importing the database connection function
import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");
import conversationRoutes from "./routes/conversation.route.js"; // importing the conversation routes
import userSearchRoutes from "./routes/user.search.routes.js"; // importing the user search routes
import messageRoutes from "./routes/messages.routes.js"; // importing the message routes
import Message from "./models/message.model.js";
import Conversation from "./models/conversation.model.js";

const app = express(); // creating an instance of the express application


dotenv.config(); // loading environment variables from .env file

const server = http.createServer(app); // creating an HTTP server using the express app
const io = new Server(server, {
  cors: {
    origin: "*", // allow requests from any origin
  },
}); // creating a new instance of the socket.io server and passing the HTTP server and CORS options

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    socket.userId = decodedToken.id; // attaching the user ID to the socket object for later use
    socket.username = decodedToken.username; // attaching the username to the socket object for later use
    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});

const onlineUsers = new Map();
const broadcastOnlineUsers = () => {
  const onlineUserIds = [...onlineUsers.keys()];
  io.emit("users:online", onlineUserIds);
  
}

io.on("connection", async(socket) => {
  console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
  // who ever wants to connect to the socket server will be authenticated using the JWT token and if the token is valid, the user ID and username will be attached to the socket object for later use
    console.log(`User connected: ${socket.userId} (${socket.username})`);
    socket.join(socket.userId); // joining the user to a room with their user ID so that we can send messages to them later

    onlineUsers.set(socket.userId, (onlineUsers.get(socket.userId) || 0) + 1);
    broadcastOnlineUsers();

    try{
      const myConversations = await Conversation.find({ participants: socket.userId }).select("_id").lean();
      const pendingMessages = await Message.find({
        conversation: { $in: myConversations.map(c => c._id) },
        sender: { $ne: socket.userId },
        deliveredTo: { $ne: socket.userId },
      }).select("_id sender").lean();

      if(pendingMessages.length > 0) {
        const messageIds = pendingMessages.map(m => m._id);
        await Message.updateMany(
          { _id: { $in: messageIds } },
          { status: "delivered", $addToSet: { deliveredTo: socket.userId } }
        );

        // group the delivered message ids by their original sender
        const messageIdsBySender = new Map();
        pendingMessages.forEach(m => {
          const senderId = m.sender.toString();
          if(!messageIdsBySender.has(senderId)) messageIdsBySender.set(senderId, []);
          messageIdsBySender.get(senderId).push(m._id.toString());
        });

        // notify each sender ONCE so their UI can show the double tick
        messageIdsBySender.forEach((ids, senderId) => {
          io.to(senderId).emit("message:delivered", { messageIds: ids, recipientId: socket.userId });
        });
      }
    }catch (error) {
        console.error("Error in connection handler:", error);
    }

    socket.on("message:send", async ({ conversationId, text }) => {
      try {
         if(!conversationId || !text) {
            socket.emit("message:error", { message: "All fields are required" });
            return;
        }
        const conversation = await Conversation.findById(conversationId);
        if(!conversation) {
            socket.emit("message:error", { message: "Conversation not found" });
            return;
        }


        const isParticipant = conversation.participants.some(participantId => participantId.toString() === socket.userId.toString());

         if(!isParticipant) {
            socket.emit("message:error", { message: "You are not a participant of this conversation" });
            console.log(`User ${socket.userId} attempted to send a message to a conversation they are not a participant of: ${conversationId}`);

            return;
        }

        const message = new Message({ conversation: conversationId, sender: socket.userId, text });
        await message.save();

        conversation.lastMessage = message._id;
        await conversation.save();

      const participants = conversation.participants.map(participantId => participantId.toString()).filter(id => id !== socket.userId.toString()); // all other participants except the sender
      const onlineParticipants = participants.filter(participantId => onlineUsers.has(participantId)); // all  participants who are online


      console.log("original message:", message);
            if(onlineParticipants.length > 0) {
              console.log(`Adding deliveredTo for message ${message._id} to online participants: ${onlineParticipants.join(", ")}`);
                await Message.findByIdAndUpdate(message._id, { 
                  status: "delivered",
                  $addToSet: { deliveredTo: { $each: onlineParticipants } } }); // we are not doign nay thing to this
          }

          const populatedMessage = await Message.findById(message._id).populate("sender", "username");
          console.log(`Populated message: ${JSON.stringify(populatedMessage)}`);  
        //we are sending the message to all participants
        conversation.participants.forEach(participantId => {
          console.log(`EEEEEEEEEEEEmitting message:new to participant: ${participantId.toString()}`);
            io.to(participantId.toString()).emit("message:new", populatedMessage);
        });

        // sending the message as delivered to all online participants
        const sender = await Message.findById(message._id).populate("sender", "username");
        // onlineParticipants.forEach(participantId => {
        //     if(onlineUsers.has(participantId)) {
        //         io.to(participantId.toString()).emit("message:new", { messageId: message._id, deliveredTo: participantId });
        //     }
        // });

      }catch (error) {
        console.error("Error sending message via socket:", error);
        socket.emit("message:error", { message: "Internal server error" });
      }

    });


    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId} (${socket.username})`);
      const currentCount = onlineUsers.get(socket.userId) || 0;
      if (currentCount <= 1) {
        onlineUsers.delete(socket.userId);
      } else {
        onlineUsers.set(socket.userId, currentCount - 1);
      }
      broadcastOnlineUsers();
    });
});


app.set("io", io); // setting the socket.io instance on the express app so that it can be accessed in other parts of the application  

 // creating a map to store the online users and their socket IDs


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
  server.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});