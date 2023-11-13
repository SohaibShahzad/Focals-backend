// require("dotenv").config();
const express = require("express");
const connectDB = require("./utils/db");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Admin = require("./models/adminModel");
const SubAdmin = require("./models/subAdminModel");
const User = require("./models/usersModel");
const Chat = require("./models/messageModel");
const servicesRoute = require("./routes/servicesRoute");
const notificationsRoute = require("./routes/notificationRoute");
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
const ioModule = require("./utils/io");

const app = express();
const mulParse = multer();
const parseData = mulParse.none();

app.use('/portfolio-images', express.static('/var/www/media/portfolio'));

app.use(
  cors({
    origin: "http://localhost:3000",
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
app.use("/portfolio", portfolioRoute);
app.use("/admins", parseData, adminsRoute);
app.use("/subAdmins", parseData, subAdminsRoute);
app.use("/contact", parseData, contactRoute);
app.use("/users", parseData, usersRoute);
app.use("/session", parseData, sessionRoute);
app.use("/testimonials", parseData, testimonialsRoute);
app.use("/projects", parseData, projectsRoute);
app.use("/notifications", parseData, notificationsRoute);
app.use("/socials", parseData, socialLinksRoute);
app.use("/termsPolicy", parseData, termsAndPolicyRoute);

// Start the server
const PORT = process.env.PORT || 5050;
const server = http.createServer(app);

ioModule.init(server, {
  cors: {
    // origin: "http://31.220.62.249:3000",
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

const io = ioModule.getIO();

const projectChatNS = io.of("/projectChats");
const usersChatNS = io.of("/usersChats");
const notificationsNS = io.of("/notifications");

notificationsNS.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("register", (userId) => {
    socket.join(userId);
    console.log(`Registered ${userId}`);
  });

  socket.on("notifyUser", ({ userId, message }) => {
    notificationsNS.to(userId).emit("notification", {
      message: message,
      date: new Date(),
    });
    console.log(`Notification sent to user ${userId}: ${message}`);
  });
});

projectChatNS.on("connection", (socket) => {
  console.log("New project chat client connected");

  socket.on("join", async ({ chatId, user }) => {
    socket.join(chatId);
    console.log(`${user} joined chat ${chatId}`);

    let chat = await Chat.findOne({ chatId: chatId });
    if (!chat) {
      chat = await Chat.create({ chatId: chatId, messages: [] });
    }

    socket.emit("chatHistory", chat.messages);
  });

  socket.on("requestChatHistory", async ({ chatId }) => {
    const chat = await Chat.findOne({ chatId: chatId });
    socket.emit("chatHistory", chat ? chat.messages : []);
  });

  socket.on("chat", async ({ chatId, user, message }) => {
    console.log(`Message from ${user} in chat ${chatId}: ${message}`);

    let chat = await Chat.findOneAndUpdate(
      { chatId: chatId },
      { $push: { messages: { user, message } } },
      { new: true, upsert: true }
    );

    // Emit the latest message to all clients in the room
    projectChatNS
      .to(chatId)
      .emit("chat", chat.messages[chat.messages.length - 1]);
  });

  socket.on("leave", ({ chatId, user }) => {
    socket.leave(chatId);
    console.log(`${user} left chat ${chatId}`);
  });

  socket.on("disconnect", () => {
    console.log("Project chat client disconnected");
  });
});

usersChatNS.on("connection", (socket) => {
  console.log("New user chat client connected");

  socket.on("join", async ({ chatId, user }) => {
    socket.join(chatId);
    console.log(`${user} joined chat ${chatId}`);

    let chat = await Chat.findOne({ chatId: chatId });
    if (!chat) {
      chat = await Chat.create({ chatId: chatId, messages: [] });
    }

    socket.emit("chatHistory", chat.messages);
  });

  socket.on("requestChatHistory", async ({ chatId }) => {
    const chat = await Chat.findOne({ chatId: chatId });
    socket.emit("chatHistory", chat ? chat.messages : []);
  });

  socket.on("chat", async ({ chatDetails, messageData }) => {
    console.log(
      `Message from ${messageData.sender} in chat ${chatDetails.id || chatDetails._id}: ${messageData.message}`
    );

    let chat = await Chat.findOneAndUpdate(
      { chatId: chatDetails.id || chatDetails._id },
      {
        $push: {
          messages: {
            user: messageData.sender,
            message: messageData.message,
            isRead: false,
          },
        },
      }, // Update this line to match the incoming data structure
      { new: true }
    );
    if (chat) {
      console.log("Chat: ", chat);
      console.log("Chat messages: ", chat.messages[chat.messages.length - 1]);
      usersChatNS
        .to(chatDetails.id)
        .emit("chat", chat.messages[chat.messages.length - 1]);
    }
  });

  socket.on("leave", ({ chatId, user }) => {
    socket.leave(chatId);
    console.log(`${user} left chat ${chatId}`);
  });

  socket.on("disconnect", () => {
    console.log("User chat client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = { app, server };
