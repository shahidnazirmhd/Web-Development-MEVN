const express=require("express");
const uuid=require("uuid");
const access=require("../utilFunctions/restaurants-data");
const router=express.Router();

router.get("/confirm", function(req, res) {
    res.render("confirm");
});

router.get("/recommend", function(req, res) {
    res.render("recommend");
});

router.post("/recommend", function(req, res) {
    const restaurant=req.body;
    restaurant.rId=uuid.v4();
     const restaurantList=access.getStoredRestaurant();
     restaurantList.push(restaurant);
     access.storeRestaurant(restaurantList);
     res.redirect("/confirm");
});

router.get("/restaurants", function(req, res) {
    let order=req.query.order;
    let nxtOder="desc";
    if (order !== "asc" && order !== "desc") {
        order="asc";
    }
    if (order === "desc") {
        nxtOder="asc";
    }
    const restaurantList=access.getStoredRestaurant();
    restaurantList.sort(function (resA, resB) {
        if(
            (order === "asc" && resA.name > resB.name)||
            (order === "desc" && resB.name > resA.name)
        ) {
            return 1;
        }
        return -1;
    });
    res.render("restaurants", {noOfRestaurants: restaurantList.length, restaurants: restaurantList, nextOrder: nxtOder});
});

router.get("/restaurants/:id", function(req, res) {
    const restaurantId=req.params.id;
    const restaurantList=access.getStoredRestaurant();
     for (const restaurant of restaurantList) {
        if (restaurant.rId===restaurantId) {
          return  res.render("restaurant-details", {restaurant: restaurant});
        }
     }
     res.status(404).render("404");
});

module.exports = router;