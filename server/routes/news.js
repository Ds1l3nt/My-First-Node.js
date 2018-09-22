var express = require('express');
var router = express.Router();
var models = require('../models');
var auth = require('connect-ensure-login').ensureLoggedIn;
var options = require('../config/options');

router.get("/",  auth('/auth/login'), async function(req,res,next){
  let news = await models.News.findAll();
  let types = options.POST_TYPES;
  res.render("news/list", {news:news,types:types});
});




module.exports = router;