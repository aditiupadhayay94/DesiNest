if (process.env.node_env != "production") {
  require("dotenv").config();
}

const dbUrl = process.env.ATLASDB_URL;

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listings = require("./routes/listing.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const reviews = require("./routes/review");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/User.js");
const user = require("./routes/user.js");
const Listing = require("./models/listing.js");
const initData = require("./init/data.js")

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser", async (req,res)=>{
//      let fakeUser = new User({
//       email:"student@gmail.com",
//       username:"sigma6.0"
//      });
//       let registerUser=await User.register(fakeUser,"helloworld");
//       res.send(registerUser);
// });

// MongoDB connection
async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'listings', 'Loader.html'));
});

app.use("/", user);
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.get("/loadList", async (req, res) => {
  await Listing.deleteMany({});
  const newData = initData.data.map((obj) => ({
    ...obj,
    owner: "68091868b1f200add8fe4aa5",
  }));
  await Listing.insertMany(newData);
  res.send("Done!").json(newData)
});

// Global Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("Error", { message, statusCode });
});

// Start Server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
