import {io} from "socket.io-client";

let socket = null;

export const connectSocket = (token) => {
      if(socket)  return socket;  
      // this is called as a singleton pattern, it ensures that only one instance of the socket is created and reused throughout the application. If a socket connection already exists, it will not create a new one.

        socket = io("http://localhost:3000", {
          auth: {
            token: token, // passing the JWT token for authentication
          },
        });
        return socket;
}


export const getSocket = () => {
     return socket; // returning the existing socket instance
}

export const disconnectSocket = () => {
    if(socket) {
        socket.disconnect(); // disconnecting the socket connection
        socket = null; // resetting the socket instance to null
    }
}