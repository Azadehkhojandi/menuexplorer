require('dotenv').config();
var express = require("express");
var app = express();
var path = require("path");

app.use('/assets', express.static(__dirname +'./../assets'));

app.get('/', function (req, res) {
  let tmp = path.join(__dirname + './../index.html');
  console.log(tmp);
  res.sendFile(path.join(__dirname + './../index.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/config', function (req, res) {
  res.json(
    {
      "services": {
        "OcrUrl": process.env.OcrUrl,
        "BingImageSearchUrl": process.env.BingImageSearchUrl,
        "TranslateUrl": process.env.TranslateUrl
      }
    });
});



var port = process.env.Port || 3000;
app.listen(port, function () {
  console.log('app listening on port ' + port + '!');
});