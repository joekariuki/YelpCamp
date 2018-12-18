var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground.js");
var Comment    = require("../models/comment.js");
var passport   = require("passport");
var User       = require("../models/user");

// ROOT 
router.get("/", function(req, res) {
    res.render("landing");
});


// ===================
// AUTH ROUTES
// ===================

// SIGN UP ROUTE
// shows register forms
router.get("/register", function(req, res) {
    res.render("register");
});

// sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    if(req.body.adminKey == "secretcode") {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user) {
        if (err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp, " + user.username + "!");
            res.redirect("/campgrounds");
        });
    });
});

// LOG IN ROUTE

//shows login form
router.get("/login", function(req, res) {
    res.render("login");
});

//login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
    
});

// LOGOUT ROUTE
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!")
    res.redirect("/campgrounds");
});


module.exports = router;