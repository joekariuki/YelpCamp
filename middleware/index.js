var Campground = require("../models/campground");
var Comment = require("../models/comment");

// ALL MIDDLEWARE
var middlwareObj = {};
    
middlwareObj.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err) {
                req.flash("error", "Campground not found!");
                res.redirect("/campgrounds")
            } else {
                
                // Bug fix
                if (!foundCampground) {
                    req.flash("error", "Campground not found");
                    return res.redirect("back");
                }
                
                 // does user own campground?
                 if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                 } else {
                    req.flash("error", "You dont have permission to do that!");
                    res.redirect("back");
                 }
            }
        });
    } else {
        res.redirect("back");
    }
};

middlwareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                req.flash("error", "Campground not foud")
                res.redirect("back")
            } else {
                 // does user own comment?
                 if(foundComment.author.id.equals(req.user._id)) {
                    next();
                 } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                 }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

// isloggedIn Middleware
middlwareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};




module.exports = middlwareObj;