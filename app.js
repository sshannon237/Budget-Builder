const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config({path: "./.env"});

const app = express();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306, 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, 
    database: process.env.DB
});

const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "hbs");

db.connect((err) =>{
    if(err){
        console.log(err.message);
    } else {
        console.log("MySQL connected...");
    }
})

app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

app.listen(3000, () => {
    console.log("Server started on port 3000");
});