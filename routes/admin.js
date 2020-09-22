const express = require('express');
const router = express.Router();
const fs = require("fs")
const path = require("path")
const csv = require("fast-csv")

router.get('/', function(req, res, next) {
  res.render("admin")
});

router.get("/data", (req,res) => {
  data = []

  fs.createReadStream(path.resolve(__dirname, "..", "data", "result.csv"))
    .pipe(csv.parse({headers: true}))
    .on('error', err => console.error(err))
    .on('data', row => data.push(row))
    .on('end', rowC => res.send({data}))
})



module.exports = router;


