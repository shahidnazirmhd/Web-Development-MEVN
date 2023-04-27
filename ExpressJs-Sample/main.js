const express=require("express");
const fs=require("fs");
const path=require("path");
const app=express();

app.use(express.urlencoded({extended: false}));  //for parsing string

app.get("/currenttime", function (request, response){
    response.send("<h1>"+new Date().toISOString()+"</h1>");
});

app.get("/", function (request, response){
    response.send("<h1>Hello ExpressJs....</h1>"+
    "<form action=\"/store-user\" method=\"POST\"><label>UserName:</label><br><input type=\"text\" name=\"uname\"><br><br><br><button>Submit</button></form>");
});

app.post("/store-user", function (request, response){
     const userName=request.body.uname;
     const filePath=path.join(__dirname,"data","user.json");
     const fileData=fs.readFileSync(filePath);
     const userList=JSON.parse(fileData);
     userList.push(userName);
     fs.writeFileSync(filePath, JSON.stringify(userList));
     console.log(userName);
     response.send("<h1>User stored successfully...</h1>");
});

app.get("/users", function (request, response){
    const filePath=path.join(__dirname,"data","user.json");
     const fileData=fs.readFileSync(filePath);
     const userList=JSON.parse(fileData);
     viewUsers="<ul>";
     for (const user of userList) {
        viewUsers+="<li>"+user+"</li>";
     }
    viewUsers+="</ul>";
    
    response.send(viewUsers);
});

app.listen(3000);