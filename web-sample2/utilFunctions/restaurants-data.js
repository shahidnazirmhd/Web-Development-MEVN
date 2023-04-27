const path=require("path");
const fs=require("fs");

const filePath=path.join(__dirname,"..","data","restaurants.json");

function getStoredRestaurant() {
     const fileData=fs.readFileSync(filePath);
     const restaurantList=JSON.parse(fileData);
     return restaurantList;
}

function storeRestaurant(storableRestaurant){
    fs.writeFileSync(filePath, JSON.stringify(storableRestaurant));
}

module.exports = {
    getStoredRestaurant: getStoredRestaurant,
    storeRestaurant: storeRestaurant
}