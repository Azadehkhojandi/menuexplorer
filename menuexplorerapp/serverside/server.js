var express = require("express");
var app = express();
var path = require("path");

app.use('/assets', express.static('assets'));

app.get('/', function (req, res) {
  let tmp = path.join(__dirname + './../index.html');
  console.log(tmp);
  res.sendFile(path.join(__dirname + './../index.html'));
  //__dirname : It will resolve to your project folder.
});


app.listen(3000);

console.log("Running at Port 3000");