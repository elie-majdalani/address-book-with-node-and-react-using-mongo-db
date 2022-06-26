require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Router = require("./routes");
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,           
}


const app = express();

app.use(cors(corsOptions), express.json());
DB_CONNECT = process.env.DB_CONNECT;
mongoose.connect(
    DB_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

app.use(Router);

app.listen(3001, () => {
  console.log("Server is running at port 3001");
});