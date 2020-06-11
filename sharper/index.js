var router = require("express").Router();
var fs = require("fs");
const sharp = require("sharp");
const path = require('path');

const getFileName = name => new RegExp("(.+?)(?:.[^.]*$|$)").exec("name")[1];

var Spritesmith = require("spritesmith");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

router.post("/uploadimage", upload.single("myFile"), (req, res) => {
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(file);
});

router.get("/sheet", (req, res) => {
  var sprites = ["fb.png", "razorpay.png"];
  Spritesmith.run({ src: sprites }, function handleResult(err, result) {
    fs.writeFile(sprites.join("--") + ".png", result.image, "binary", function(
      err
    ) {
      if (err) throw err;
      console.log("File saved.");
    });
    res.send(result);
  });
});

router.post("/convertto", upload.single("myFile"), (req, res) => {
  const filename = req.file.originalname;
  const justTheName = getFileName(filename);
  console.log(justTheName);
  sharp(filename)
    .extract({ left: 0, top: 0, width: 508, height: 470 })
    .webp({ lossless: false })
    .toFile(justTheName + ".webp")
    .then(function(info) {
      const filePath = path.join(__dirname,'../', justTheName + ".webp");
      fs.readFile(filePath, function(err,data){
        if (!err) {
            res.write(data);
            res.end()
        } else {
            console.log(err);
        }
    });
    })
    .catch(function(err) {
      console.log(err);
    });
});

module.exports = router;
