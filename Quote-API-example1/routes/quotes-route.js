const express=require("express");

const quoteController=require("../controllers/quotes-controller");

const router=express.Router();

router.get("/", quoteController.getRandomQuote);

module.exports = router;