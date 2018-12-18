var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Review = require("../models/review");
var middleware = require("../middleware");


// NEW - takes you to new review page
router.get("/new", middleware.isLoggedIn, middleware.checkReviewExistence, function (req, res) {
    // middleware.checkReviewExistence checks if user already reviewed the campground
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.render("reviews/new", {campground: campground});
        }
        
    });
});

// CREATE - creates a review
router.post("/", middleware.isLoggedIn, middleware.checkReviewExistence, function (req, res) {
   Campground.findById(req.params.id).populate("reviews").exec(function (err, campground) {
       if (err) {
           req.flash("error", err.message);
           res.redirect("back");
       } else {
           Review.create(req.body.review, function (err, review) {
               if(err) {
                   req.flash("error", err.message);
                   res.redirect("back");
               } else {
                   review.author.id = req.user.id;
                   review.author.username = req.user.username;
                   review.campground = campground;
                   // save review
                   review.save();
                   campground.reviews.push(review);
                   // calculate the new average review for th campground
                   campground.rating = calculateAverage(campground.reviews);
                   // save campground
                   campground.save();
                   req.flash("success", "Your review has been successfully added.");
                   res.redirect('/campgrounds/' + campground._id);
               }
           });
       }
   });
});

// EDIT - edits a review
router.get("/:review_id/edit", middleware.checkReviewOwnership, function(req, res) {
    Review.findById(req.params.review_id, function (err, foundReview) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.render("reviews/edit", {campground_id: req.params.id, review: foundReview});
        }
    })
})

function calculateAverage(reviews) {
    if (reviews.length === 0) {
        return 0;
    }
    var sum = 0;
    reviews.forEach(function (element) {
        sum += element.rating;
    });
    return sum / reviews.length;
}

module.exports = router;