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
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(user);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
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
    res.redirect("/campgrounds");
});

// isloggedIn Middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;