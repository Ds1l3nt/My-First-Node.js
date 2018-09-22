var express = require('express');
var router = express.Router();
var models = require('../models');
const multer  = require('multer');
const thumbnailUpload = multer({ dest: 'public/uploads/products' });
var auth = require('connect-ensure-login').ensureLoggedIn;


/* GET locations. */ //async... await
router.get('/', auth('/auth/login'), async function(req, res, next) {
  let products = await models.Product.findAll({
    include:[
      models.Brand,
      models.Category
    ]
  });  
  res.render('products/list', {products:products});
});


/* GET create location form. */
router.get('/create', async function(req, res, next) {
    let categories = await models.Category.findAll();  
    let brands = await models.Brand.findAll();  

    res.render('products/create', {categories:categories,brands:brands});
});

/* POST Store location. */
router.post('/store', thumbnailUpload.single('thumbnail'), async function(req, res, next) {
  let formData = req.body;
  let photo = req.file;
  if(photo){
    formData.thumbnail = photo.filename;
  }
  let result = await models.Product.create(formData);
  if(result)
  {
    return res.redirect("/products");
  } 
});

/* POST Edit location. */
router.get('/:id/edit', async function(req, res, next) {
  let id = req.params.id;
  let categories = await models.Category.findAll();  
  let brands = await models.Brand.findAll();  

  models.Product.findById(id).then( (data)=>{
    res.render('products/edit',{product:data, categories:categories,brands:brands});
  });
});

/* POST update a  package. */
router.post('/:id/update', thumbnailUpload.single('thumbnail'), function(req, res, next) {
  let id = req.params.id;
  let formData = req.body;  
 
  let photo = req.file;
  if(photo){
    formData.thumbnail = photo.filename;
  }
  //Promise way
  models.Product.update(formData, {where:{id:id}}).then((data,err)=>{
        res.redirect("/products");
  });
});

// Delete Location
router.get("/:id/delete", function(req, res, next){
  let id = req.params.id;
  models.Product.destroy({where:{id:id}}).then(data=>{
     res.redirect("/products");
  });
});
module.exports = router;