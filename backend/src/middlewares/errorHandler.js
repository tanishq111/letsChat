
/* centralized error handling middleware */
const errorHandler = (err, req, res, next) => {
  console.log("Error handling middleware called");
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
};

export default errorHandler;



//HW -> how to use this errorHandler.js in server.js and how to use it in routes and controllers