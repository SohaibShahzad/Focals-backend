const nodemailer = require("nodemailer");

const sendEmail = async (req, res) => {
  const { name, email, message } = req.body;
  console.log(email);
  console.log(name);
  console.log(message);

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sohaib022k@gmail.com",
      pass: "zbzwrjmkxyzbunyp",
    },
  });
  let mailOptions = {
    from: "FutureFocals",
    to: "sohaib022k@gmail.com",
    subject: `Subject: ${name}`,
    html: `${message} ${email}`,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    console.log('testing');
    if (err) {
        console.log('error');
      res.json(err);
    } else {
      console.log("Did it work?");
      res.json(info);
    }
  });

  //   let transporter = nodemailer.createTransport({
  //     service: "gmail",
  //     auth: {
  //       type: "OAuth2",
  //       user: "sohaib0919@gmail.com",
  //       pass: "@Mynissm4f1f4",
  //       clientId:
  //         "368642945800-qodp2ola3vqm5ipbulsha82fk69pfdeq.apps.googleusercontent.com",
  //       clientSecret: "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",
  //       refreshToken:
  //         "1//04nAaKEsm3GCJCgYIARAAGAQSNwF-L9IrDAnv2sWg_XsNpkdp3ej67Kj6KrwJD-mg8nolKUU8DJK5OQcJ35iWBX_RvFVn3xx-Cog",
  //     },
  //   });

  //   const mailOptions = {
  //       from: email,
  //       to: "sohaib0919@gmail.com",
  //       subject: `Message from ${name}`,
  //       text: message,
  //   };

  //   try {
  //       await transporter.sendMail(mailOptions);
  //       res.status(200).json({ message: "Email sent" });
  //   }
  //   catch (error) {
  //       console.log(error);
  //       res.status(500).json({ message: "Internal Server Error" });
  //   }
};

//
module.exports = {
  sendEmail,
};
