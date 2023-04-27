const path=require("path");
const fs=require("fs");
const express=require("express");
const uuid=require("uuid");
const app=express();

app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.urlencoded({extended: false})); 

app.get("/", function(req, res) {
    // const filePath=path.join(__dirname,"views","index.html");
    // res.sendFile(filePath);
    res.render("index");  //  bcoz of template engine - ejs
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.get("/confirm", function(req, res) {
    res.render("confirm");
});

app.get("/recommend", function(req, res) {
    res.render("recommend");
});

app.post("/recommend", function(req, res) {
    const restaurant=req.body;
    restaurant.rId=uuid.v4();
     const filePath=path.join(__dirname,"data","restaurants.json");
     const fileData=fs.readFileSync(filePath);
     const restaurantList=JSON.parse(fileData);
     restaurantList.push(restaurant);
     fs.writeFileSync(filePath, JSON.stringify(restaurantList));
     res.redirect("/confirm");
});

app.get("/restaurants", function(req, res) {
    const filePath=path.join(__dirname,"data","restaurants.json");
     const fileData=fs.readFileSync(filePath);
     const restaurantList=JSON.parse(fileData);
    res.render("restaurants", {noOfRestaurants: restaurantList.length, restaurants: restaurantList});
});

app.get("/restaurants/:id", function(req, res) {
    const restaurantId=req.params.id;
    const filePath=path.join(__dirname,"data","restaurants.json");
     const fileData=fs.readFileSync(filePath);
     const restaurantList=JSON.parse(fileData);
     for (const restaurant of restaurantList) {
        if (restaurant.rId===restaurantId) {
          return  res.render("restaurant-details", {restaurant: restaurant});
        }
     }
     res.status(404).render("404");
});

app.use(function(req, res) {
    res.status(404).render("404");
});

app.use(function(error, req, res, next) {
    res.status(500).render("500");
});

app.listen(3000);