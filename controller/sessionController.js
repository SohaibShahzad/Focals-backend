// server.js
const getSession = (req, res) => {
  console.log("session1");
  console.log("Request session:", req.session);
  console.log("Request headers:", req.headers);
  console.log("Received request");
  if (req.isAuthenticated()) {
    console.log("Authenticated");
    res.status(200).json({ authenticated: true, user: req.user });
  } else {
    console.log("Not authenticated");
    res.status(200).json({ authenticated: false });
  }
};
  

module.exports = {
  getSession,
};
