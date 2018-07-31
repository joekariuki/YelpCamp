var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground.js");
var Comment    = require("../models/comment.js");

// INDEX - show all campgrounds
router.get("/", function(req, res) {
        req.user;
        // Get all campgrounds from db
        Campground.find({}, function(err, allCampgrounds) {
            if(err) {
                console.log(err);
            } else {
                res.render("campgrounds/index", {campgrounds: allCampgrounds});
            }
        });
});

// Create - add new campground to DB
router.post("/", isLoggedIn, function(req, res) {
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author: author}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            // redirect back to campgrounds page
            // console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res) {
    // find the camp page
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err)
        } else {
            // render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT - edits campgrounds
router.get("/:id/edit", checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE - updates campgrounds
router.put("/:id", checkCampgroundOwnership, function(req, res) {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            // redirect to show page
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY - destroys campgrounds
router.delete("/:id", checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
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

function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
       
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err) {
                res.redirect("/campgrounds")
            } else {
                 // does user own campground?
                 if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                 } else {
                    res.redirect("back");
                 }
            }
        });
    } else {
        res.redirect("back");
    }
};

module.exports = router;