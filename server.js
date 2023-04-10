// const express = require("express");
// const connectDB = require("./utils/db");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const multer = require("multer");
// const session = require("express-session");
// const passport = require("passport");
// const Admin = require("./models/adminModel");
// const servicesRoute = require("./routes/servicesRoute");
// const blogsRoute = require("./routes/blogsRoute");
// const portfolioRoute = require("./routes/portfolioRoute");
// const adminsRoute = require("./routes/adminsRoute");
// const contactRoute = require("./routes/contactRoute");
// const next = require("next");

// const dev = process.env.NODE_ENV !== "production";
// const nextApp = next({ dev });
// const handle = nextApp.getRequestHandler();

// nextApp.prepare().then(() => {
//   const app = express();
//   const mulParse = multer();
//   const upload = multer({ dest: "public/uploads/" });

//   app.use(cors());

//   app.use(bodyParser.json());
//   app.use(bodyParser.urlencoded({ extended: true }));
//   app.use(mulParse.none());
//   app.use(session({
//     secret: "FutureFocals",
//     resave: false,
//     saveUninitialized: false,
//   }));
//   app.use(passport.initialize());
//   app.use(passport.session());

//   // Connect to MongoDB
//   connectDB();

//   // Passport
//   passport.use(Admin.createStrategy());
//   passport.serializeUser(Admin.serializeUser());
//   passport.deserializeUser(Admin.deserializeUser());

//   // Setup routes
//   app.use("/services", servicesRoute);
//   app.use("/blogs", blogsRoute);
//   app.use("/portfolio", portfolioRoute);
//   app.use("/admins", adminsRoute);
//   app.use("/contact", contactRoute);

//   // Serve Next.js static files
//   app.get("*", (req, res) => {
//     return handle(req, res);
//   });

//   // Start the server
// //   const PORT = process.env.PORT || 5000;
//   app.listen(process.env.PORT || 5000, () => {
//     console.log(`Server started on port 5000`);
//   });
// });


const express = require("express");
const connectDB = require("./utils/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const session = require("express-session");
const passport = require("passport");
const Admin = require("./models/adminModel");
const servicesRoute = require("./routes/servicesRoute");
const blogsRoute = require("./routes/blogsRoute");
const portfolioRoute = require("./routes/portfolioRoute");
const adminsRoute = require("./routes/adminsRoute");
const contactRoute = require("./routes/contactRoute");


const app = express();
const mulParse = multer();
const upload = multer({ dest: "public/uploads/" });

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(mulParse.none());
app.use(session({
  secret: "FutureFocals",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
connectDB();

// Passport
passport.use(Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

// Setup routes
app.use("/services", servicesRoute);
app.use("/blogs", blogsRoute);
app.use("/portfolio", portfolioRoute);
app.use("/admins", adminsRoute);
app.use("/contact", contactRoute);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
