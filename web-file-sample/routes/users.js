const express = require('express');
const multer = require('multer');
const db = require( '../data/database' );

const storageDetail = multer.diskStorage({
  destination: function (req, file, callBack) {
    callBack(null, "images");
  },
  filename: function (req, file, callBack) {
    callBack(null, Date.now()+"-"+file.originalname);
  }
});

//const upload = multer({dest: "images"});
const upload = multer({storage: storageDetail}); //- To control storage option in multer
const router = express.Router();

router.get('/', async function(req, res) {
  const result = await db.getDb().collection("users").find().toArray();
  res.render('profiles', {users: result});
});

router.get('/new-user', function(req, res) {
  res.render('new-user');
});

router.post('/profiles', upload.single("image"), async function(req, res) {
  const file= req.file;
  const user=req.body;
  const result = await db.getDb().collection("users").insertOne({
    name: user.username,
    imagePath: file.path
  });
  console.log(result);
  res.redirect("/");
});

module.exports = router;