const express = require("express");
const connectDB = require("./utils/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Admin = require("./models/adminModel");
const User = require("./models/usersModel");
const servicesRoute = require("./routes/servicesRoute");
const blogsRoute = require("./routes/blogsRoute");
const portfolioRoute = require("./routes/portfolioRoute");
const adminsRoute = require("./routes/adminsRoute");
const contactRoute = require("./routes/contactRoute");
const usersRoute = require("./routes/usersRoute");
const sessionRoute = require("./routes/sessionRoute");
const testimonialsRoute = require("./routes/testimonialsRoute");

const app = express();
const mulParse = multer();
const upload = multer({ dest: "public/uploads/" });

app.use(
  cors({
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(mulParse.none());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.use(passport.initialize());

// Connect to MongoDB
connectDB();

// Passport
passport.use("admin", new LocalStrategy(Admin.authenticate()));
passport.use("user", new LocalStrategy(User.authenticate()));

passport.serializeUser((user, done) => {
  done(null, { id: user.id, type: user.type });
});

passport.deserializeUser((obj, done) => {
  if (obj.type === "admin") {
    Admin.findById(obj.id, (err, user) => {
      done(err, user);
    });
  } else if (obj.type === "user") {
    User.findById(obj.id, (err, user) => {
      done(err, user);
    });
  }
});


// Setup routes
app.use("/services", servicesRoute);
app.use("/blogs", blogsRoute);
app.use("/portfolio", portfolioRoute);
app.use("/admins", adminsRoute);
app.use("/contact", contactRoute);
app.use("/users", usersRoute);
app.use("/session", sessionRoute);
app.use("/testimonials", testimonialsRoute);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
