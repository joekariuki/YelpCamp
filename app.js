var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
            {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1483381719261-6620dfa2d28a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b201f4cac49215d2be151bb4d5bc454f&auto=format&fit=crop&w=1055&q=80"},
            {name: "Granite Hill", image: "https://images.unsplash.com/photo-1520095972714-909e91b038e5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1110ecf3ce9e4184d4676c54dec0032d&auto=format&fit=crop&w=1050&q=80"},
            {name: "Mountain Duck", image: "https://images.unsplash.com/photo-1516245486328-acf990de3035?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=8d1fac07d2222dd68ad3e15b0e9bb47d&auto=format&fit=crop&w=675&q=80"}
        ];

app.get("/", function(req, res) {
    res.render("landing");
});


app.get("/campgrounds", function(req, res) {
        res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res) {
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image}
    campgrounds.push(newCampground)
    // redirect back to campgrounds page
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp Server On")
});