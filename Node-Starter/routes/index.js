var express = require('express')
var router = express.Router()

// This is the home page

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route and load index.html page
router.get('/', function (req, res) {
    res.sendFile('index.html', {root: './Views'});
})
// define the about route
router.get('/about', function (req, res) {
  res.send('About us')
})

module.exports = router