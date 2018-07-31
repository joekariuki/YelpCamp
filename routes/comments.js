var express    = require("express");
var router     = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");
var Comment    = require("../models/comment.js");
// ======================
// COMMENTS ROUTES
// ======================

// New Comments
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

// Create Comments
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
                    
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    // create new comment
                    campground.comments.push(comment);
                    // connect new comment to campground
                    campground.save();
                    // console.log(comment);
                    // redirect to campground show page
                    res.redirect("/campgrounds/" + campground._id);
                    
                }
            });
        }
        
    });
});

// EDIT COMMENT ROUTE
router.get("/:comment_id/edit", function(req, res) {
    Comment.findById(req.params.comment_id, function (err, foundCommment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundCommment});
        }
    });
})

// UPDATE COMMENT ROUTE
router.put("/:comment_id", function (req, res) {
    res.send("YOU HIT THE UPDATE ROUTE FOR COMMENTS");
});

// isloggedIn Middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;
