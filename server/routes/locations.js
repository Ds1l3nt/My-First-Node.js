var express = require('express');
var router = express.Router();
var models = require('../models');
var auth = require('connect-ensure-login').ensureLoggedIn;
var options = require('../config/options');

/* GET locations. */ //async... await
router.get('/', auth('/auth/login'),  async function(req, res, next) {
//  let locations = await models.Location.findAll();
//  let types = options.LOCATION_TYPES;
  res.render('locations/list');
});

router.post('/getData', auth('/auth/login'),  async function(req, res, next) {

    let locations = await models.Location.findAll();
    let types = options.LOCATION_TYPES;

        locations.map(function(location,i){
             location.type = types[location.type];
            return location;
        });
    
        res.json({data:locations});
});


/* GET locations */ //promise
// router.get('/',  function(req, res, next) {
//          models.Location.findAll()
//          .then( (result)=>{
//             res.render('locations/list', {locations:result});
//         });
// });
    
/* GET create location form. */
router.get('/create', auth('/auth/login'), function(req, res, next) {
   let types = options.LOCATION_TYPES;
    res.render('locations/create',{types:types});
});
  
/* POST store location */
router.post('/store', async function(req,res,next){
   let formData = req.body;
   let result = await models.Location.create(formData);
    if(result){
        return res.redirect("/locations");
    }
});

/* GET edit location form. */
router.get('/:id/edit', auth('/auth/login'), async function(req, res, next) {
    let id = req.params.id;
    let types = options.LOCATION_TYPES;
    let location = await models.Location.findById(id);
    res.render('locations/edit',{location:location, types:types});
 });

/* POST update location */
router.post('/:id/update', async function(req,res,next){
    let formData = req.body;
    let id = req.params.id;
    let result = await models.Location.update(formData,{where:{id:id}});
     if(result){
         return res.redirect("/locations");
     }
 });


// Delete Location
router.get("/:id/delete", auth('/auth/login'), function(req, res, next){
    let id = req.params.id;
    models.Location.destroy({where:{id:id}}).then(data=>{
       res.redirect("/locations");
    });
  });

module.exports = router;