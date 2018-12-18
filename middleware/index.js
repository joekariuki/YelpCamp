var Campground = require("../models/campground");
var Comment = require("../models/comment");
var Review = require("../models/review");

// ALL MIDDLEWARE
var middlwareObj = {};

// check campground ownership    
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

// check comment ownership
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

// check review ownership
middlwareObj.checkReviewOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Review.findById(req.params.review_id, function(err, foundReview){
            if(err || !foundReview){
                res.redirect("back");
            }  else {
                // does user own the comment?
                if(foundReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
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