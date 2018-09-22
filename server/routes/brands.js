var express = require('express');
var router = express.Router();
var models = require('../models');
const multer  = require('multer');
const thumbnailUpload = multer({ dest: 'public/uploads/brands' });
var auth = require('connect-ensure-login').ensureLoggedIn;

/* GET locations. */ //async... await
router.get('/', auth('/auth/login'), async function(req, res, next) {
  let brands = await models.Brand.findAll();  
  res.render('brands/list', {brands:brands});
});


/* GET create location form. */
router.get('/create', auth('/auth/login'), function(req, res, next) {
    res.render('brands/create');
});

/* POST Store location. */
router.post('/store', thumbnailUpload.single('logo'), async function(req, res, next) {
  let formData = req.body;
  let photo = req.file;
  if(photo){
    formData.logo = photo.filename;
  }
  let result = await models.Brand.create(formData);
  if(result)
  {
    return res.redirect("/brands");
  } 
});

/* POST Edit location. */
router.get('/:id/edit', auth('/auth/login'), function(req, res, next) {
  let id = req.params.id;
  models.Brand.findById(id).then( (data)=>{
    res.render('brands/edit',{brand:data});
  });
});

/* POST update a  package. */
router.post('/:id/update', thumbnailUpload.single('logo'), function(req, res, next) {
  let id = req.params.id;
  let formData = req.body;  
 
  let photo = req.file;
  if(photo){
    formData.logo = photo.filename;
  }
  //Promise way
  models.Brand.update(formData, {where:{id:id}}).then((data,err)=>{
        res.redirect("/brands");
  });
});

// Delete Location
router.get("/:id/delete", auth('/auth/login'), function(req, res, next){
  let id = req.params.id;
  models.Brand.destroy({where:{id:id}}).then(data=>{
     res.redirect("/brands");
  });
});
module.exports = router;