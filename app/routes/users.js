'use strict';

var User = require('../models/user');

exports.register = function(req, res){
  res.render('users/register', {title:'Register User'});
};

exports.create = function(req, res){
  var user = new User(req.body);
  user.register(function(){
    if(user._id){
      res.redirect('/');
    }else{
      res.render('users/register', {title:'Register User'});
    }
  });
};

exports.login = function(req, res){
  res.render('users/login', {title:'Please Login'});
};

exports.auth = function(req, res){
  User.findByEmailAndPassword(req.body.email, req.body.password, function(user){
    if(user){
      req.session.regenerate(function(){
        req.session.userId = user._id.toString();
        req.session.save(function(){
          res.redirect('/');
        });
      });
    }else{
      req.session.destroy(function(){
        res.render('users/login', {title:'Please Login'});
      });
    }
  });
};
