const express = require("express");
const connectDB = require("./utils/db");
const http = require("http");
const socketIO = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Admin = require("./models/adminModel");
const SubAdmin = require("./models/subAdminModel");
const User = require("./models/usersModel");
const Message = require("./models/messageModel");
const servicesRoute = require("./routes/servicesRoute");
const blogsRoute = require("./routes/blogsRoute");
const portfolioRoute = require("./routes/portfolioRoute");
const adminsRoute = require("./routes/adminsRoute");
const subAdminsRoute = require("./routes/subAdminsRoute");
const contactRoute = require("./routes/contactRoute");
const usersRoute = require("./routes/usersRoute");
const sessionRoute = require("./routes/sessionRoute");
const testimonialsRoute = require("./routes/testimonialsRoute");
const projectsRoute = require("./routes/projectsRoute");
const socialLinksRoute = require("./routes/socialLinksRoute");
const termsAndPolicyRoute = require("./routes/termsAndPolicyRoute");

const app = express();
const mulParse = multer();
const parseData = mulParse.none();

app.use(
  cors({
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.use(passport.initialize());

// Connect to MongoDB
connectDB();

// Passport
passport.use("admin", new LocalStrategy(Admin.authenticate()));
passport.use("subAdmin", new LocalStrategy(SubAdmin.authenticate()));
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
  } else if (obj.type === "subAdmin") {
    SubAdmin.findById(obj.id, (err, user) => {
      done(err, user);
    });
  }
});

// Setup routes

app.get("/api/youtube-proxy", async (req, res) => {
  try {
    const youtubeApiUrl = "https://www.youtube.com/iframe_api";
    const response = await axios.get(youtubeApiUrl);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "text/javascript");
    res.send(response.data);
  } catch (error) {
    res.status(500).send("Error proxying YouTube API request");
  }
});

app.use("/services", servicesRoute);
app.use("/blogs", blogsRoute);
app.use("/portfolio", parseData, portfolioRoute);
app.use("/admins", parseData, adminsRoute);
app.use("/subAdmins", parseData, subAdminsRoute);
app.use("/contact", parseData, contactRoute);
app.use("/users", parseData, usersRoute);
app.use("/session", parseData, sessionRoute);
app.use("/testimonials", parseData, testimonialsRoute);
app.use("/projects", parseData, projectsRoute);
app.use("/socials", parseData, socialLinksRoute);
app.use("/termsPolicy", parseData, termsAndPolicyRoute);

// Start the server
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// const io = socketIO(server);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join", async ({ chatId, user }) => {
    socket.join(chatId);
    console.log(`${user} joined ${chatId}`);

    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    socket.emit("chatHistory", messages);
  });

  socket.on("chat", async ({ chatId, user, message }) => {
    // Log the received message
    console.log(
      `Received message: ${message} from user: ${user} in chatId: ${chatId}`
    );

    const savedMessages = await Message.create({ chatId, user, message })

    io.to(chatId).emit("chat", savedMessages);
  });

  socket.on("leave", ({ chatId, user }) => {
    socket.leave(chatId);
    console.log(`${user} left ${chatId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
