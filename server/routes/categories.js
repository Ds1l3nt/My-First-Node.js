var express = require('express');
var router = express.Router();
var models = require('../models');
const multer  = require('multer');
const thumbnailUpload = multer({ dest: 'public/uploads/categories' });
var auth = require('connect-ensure-login').ensureLoggedIn;

/* GET locations. */ //async... await
router.get('/', auth('/auth/login'), async function(req, res, next) {
  let categories = await models.Category.findAll();  
  res.render('categories/list', {categories:categories});
});


/* GET create location form. */
router.get('/create', auth('/auth/login'), function(req, res, next) {
    res.render('categories/create');
});

/* POST Store location. */
router.post('/store', thumbnailUpload.single('icon'), async function(req, res, next) {
  let formData = req.body;
  let photo = req.file;
  if(photo){
    formData.icon = photo.filename;
  }
  let result = await models.Category.create(formData);
  if(result)
  {
    return res.redirect("/categories");
  } 
});

/* POST Edit location. */
router.get('/:id/edit', auth('/auth/login'), function(req, res, next) {
  let id = req.params.id;
  models.Category.findById(id).then( (data)=>{
    res.render('categories/edit',{category:data});
  });
});

/* POST update a  package. */
router.post('/:id/update', thumbnailUpload.single('icon'), function(req, res, next) {
  let id = req.params.id;
  let formData = req.body;  
 
  let photo = req.file;
  if(photo){
    formData.icon = photo.filename;
  }
  //Promise way
  models.Category.update(formData, {where:{id:id}}).then((data,err)=>{
        res.redirect("/categories");
  });
});

// Delete Location
router.get("/:id/delete", function(req, res, next){
  let id = req.params.id;
  models.Category.destroy({where:{id:id}}).then(data=>{
     res.redirect("/categories");
  });
});
module.exports = router;