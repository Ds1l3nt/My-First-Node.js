var express = require('express');
var router = express.Router();
var models = require('../models');
var bcrypt = require('bcryptjs');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var options = require('../config/options');
var auth = require('connect-ensure-login').ensureLoggedIn;
var NoStaff = require('../middlewares/NoStaff');


//STAFF not allow
// router.use(function (req, res, next) {
//   if(req.user.role == models.User.STAFF){
//     req.flash("errors","You do not have permission to access that page!");
//     return res.redirect("/");
//   }
//   next();
// });




/* GET locations. */ //async... await
router.get('/',auth('/auth/login'),  async function(req, res, next) {
  let users = await models.User.findAll();  
  res.render('users/list', {users:users});
});


/* GET create location form. */
router.get('/create', NoStaff,  function(req, res, next) {
  let roles = options.ROLES;
    res.render('users/create',{roles:roles});
});

/* POST Store location. */
router.post('/store', async function(req, res, next) {
  let formData = req.body; 
  //validation 
  let userExists = await models.User.findAll({where:{[Op.or]: [{phone: formData.phone}, {email: formData.email}]}});
  console.log(userExists);
  if(userExists && userExists.length > 0){
    req.flash("errors","Email or phone number is already in use!");
    return res.redirect("/users/create");
  }
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(formData.password, salt);
  formData.password = hash;

  let result = await models.User.create(formData);
  if(result)
  {
    return res.redirect("/users");
  }else{
    console.log(result);
  } 
});

/* GET Edit user. */
router.get('/:id/edit', auth('/auth/login'), function(req, res, next) {
  let id = req.params.id;
  let roles = options.ROLES;

  models.User.findById(id).then( (data)=>{
    res.render('users/edit',{user:data, roles:roles});
  });
});

/* POST update a  package. */
router.post('/:id/update', function(req, res, next) {
  let id = req.params.id;
  let formData = req.body;   
  
  //Promise way
  models.User.update(formData, {where:{id:id}}).then((data,err)=>{
        res.redirect("/users");
  });
});

// Delete Location
router.get("/:id/delete", function(req, res, next){
  let id = req.params.id;
  models.User.destroy({where:{id:id}}).then(data=>{
     res.redirect("/users");
  });
});

/* GET Edit user. */
router.get('/profile', auth('/auth/login'), function(req, res, next) {
  let roles = options.ROLES;
  res.render('users/profile',{user:req.user,roles:roles});
});

/* POST updat user. */
router.post('/profile', auth('/auth/login'), function(req, res, next) {
  let id = req.user.id;
  let formData = req.body;   

  if(formData.new_password){
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(formData.new_password, salt);
    formData.password = hash;
  }
  //Promise way
  models.User.update(formData, {where:{id:id}}).then((data,err)=>{
        res.redirect("/users/profile");
  });

});



module.exports = router;