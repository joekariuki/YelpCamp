var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");

// requiring routes
var commentsRoutes   = require("./routes/comments"),
    indexRoutes       = require("./routes/index.js"),
    campgroundRoutes = require("./routes/campgrounds");
    

    
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// seedDB(); // seed the database


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Secret page",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// currentUser middlewmoare
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});


app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp Server On");
});

