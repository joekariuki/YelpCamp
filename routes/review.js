var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Review = require("../models/review");
var middleware = require("../middleware");


// New Reviews Route
router.get("/new", middleware.isLoggedIn, middleware.checkReviewExistence, function (req, res) {
    // middleware.checkReviewExistence checks if user already reviewed the campground
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/new", {campground: campground});
    });
});

module.exports = router;