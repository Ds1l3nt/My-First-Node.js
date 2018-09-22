var express = require('express');
var router = express.Router();
var models = require('../../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

/* GET products. */ //async... await
router.get('/',  async function(req, res, next) {
  let params = req.query;
  let where = {};

  //filter by brand
   if(params.brand){
     where.brand_id = params.brand;
   }
  // filter by category
   if(params.category){
    where.category_id = params.category;
  }
 // search by title keyword
  if(params.q){
    where.title = { [Op.like]: '%'+params.q+'%'};
  }
  // filter by min price
  if(params.min_price){
    where.price = { [Op.gte]: params.min_price};
  }
  // filter by max price
  if(params.max_price){
    where.price = { [Op.lte]: params.max_price};
  }
  
  let products = await models.Product.findAll({
    where: where,
    include:[
      models.Brand,
      models.Category
    ]
  });  
  //fake delay
  setTimeout(function(){
    res.json({products:products});
  }, 2000);

 //res.json({products:products});

});


module.exports = router;
