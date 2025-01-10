const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();
const path = require("path")
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(3000, ()=>{
    console.log("Server is listening to 3000");
})

const sessionOption = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true
};

app.use(session(sessionOption));
app.use(flash());

app.get("/register", (req, res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    req.flash("success", "User register successfully");
    res.redirect("/hello")
})

app.get("/hello", (req, res)=>{
    console.log(req.flash("success"));
    res.render("page.ejs", {name: req.session.name});
})

// app.get("/reqcount", (req, res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`You send the request ${req.session.count} times`);
// })

// app.get("/test", (req, res)=>{
//     res.send("test successfull");
// })