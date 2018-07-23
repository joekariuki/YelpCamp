var express    = require("express");
var router     = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");
var Comment    = require("../models/comment.js");
// ======================
// COMMENTS ROUTES
// ======================

router.get("/new",isLoggedIn, function(req, res) {
    // find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    });
   
});

router.post("/", isLoggedIn, function(req, res) {
    //lookup campground by ID
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.direct("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    // create new comment
                    campground.comments.push(comment);
                    // connect new comment to campground
                    campground.save();
                    // redirect to campground show page
                    res.redirect("/campgrounds/" + campground._id);
                    console.log(campground.comments);
                }
            });
        }
        
    });
});

// isloggedIn Middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;
