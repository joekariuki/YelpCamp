var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"); 

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema ({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//       name: "Granite Hill", 
//       image: "https://images.unsplash.com/photo-1520095972714-909e91b038e5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1110ecf3ce9e4184d4676c54dec0032d&auto=format&fit=crop&w=600&q=80"
//     }, function(err, campground) {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("NEWLY CREATED CAMPGROUND: ")
//             console.log(campground);
//         }
//     });

// Initial Data Structure
// var campgrounds = [
//             {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=45fc8a446ad11a120c543c426382119f&w=600&q=80"},
//             {name: "Granite Hill", image: "https://images.unsplash.com/photo-1520095972714-909e91b038e5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1110ecf3ce9e4184d4676c54dec0032d&auto=format&fit=crop&w=600&q=80"},
//             {name: "Mountain Duck", image: "https://images.unsplash.com/photo-1444124818704-4d89a495bbae?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a128b113cb6090ba5d87ee29fc3a7869&w=1000&q=80"},
//             {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=45fc8a446ad11a120c543c426382119f&w=600&q=80"},
//             {name: "Granite Hill", image: "https://images.unsplash.com/photo-1520095972714-909e91b038e5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1110ecf3ce9e4184d4676c54dec0032d&auto=format&fit=crop&w=600&q=80"},
//             {name: "Mountain Duck", image: "https://images.unsplash.com/photo-1444124818704-4d89a495bbae?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a128b113cb6090ba5d87ee29fc3a7869&w=1000&q=80"},
//             {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=45fc8a446ad11a120c543c426382119f&w=600&q=80"},
//             {name: "Granite Hill", image: "https://images.unsplash.com/photo-1520095972714-909e91b038e5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1110ecf3ce9e4184d4676c54dec0032d&auto=format&fit=crop&w=600&q=80"},
//             {name: "Mountain Duck", image: "https://images.unsplash.com/photo-1444124818704-4d89a495bbae?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a128b113cb6090ba5d87ee29fc3a7869&w=1000&q=80"},
//             {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=45fc8a446ad11a120c543c426382119f&w=600&q=80"},
//             {name: "Granite Hill", image: "https://images.unsplash.com/photo-1520095972714-909e91b038e5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1110ecf3ce9e4184d4676c54dec0032d&auto=format&fit=crop&w=600&q=80"},
//             {name: "Mountain Duck", image: "https://images.unsplash.com/photo-1444124818704-4d89a495bbae?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a128b113cb6090ba5d87ee29fc3a7869&w=1000&q=80"}
//         ];

app.get("/", function(req, res) {
    res.render("landing");
});


app.get("/campgrounds", function(req, res) {
        // Get all campgrounds from db
        Campground.find({}, function(err, allCampgrounds) {
            if(err) {
                console.log(err);
            } else {
                res.render("campgrounds", {campgrounds: allCampgrounds});
            }
        });
});

app.post("/campgrounds", function(req, res) {
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            // redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp Server On")
});