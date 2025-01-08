const express = require("express");
const app = express();
const session = require("express-session");

app.listen(3000, ()=>{
    console.log("Server is listening to 3000");
})

app.use(session({
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true
}));

app.get("/reqcount", (req, res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count = 1;
    }
    res.send(`You send the request ${req.session.count} times`);
})

app.get("/test", (req, res)=>{
    res.send("test successfull");
})