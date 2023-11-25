const express = require("express");
const { errorHandler } = require("./middleware/errorhandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

const app = express();

// the function to connect to the database
connectDb();

const port = process.env.PORT || 5000;

// this is middleware
app.use(express.json());
app.use("/api/users",require("./routes/userRoutes"));
app.use("/api/contacts",require("./routes/contactRoutes"));
app.use(errorHandler)

app.listen(port,()=>{
    console.log(`server is listening on port:${port}`);
})