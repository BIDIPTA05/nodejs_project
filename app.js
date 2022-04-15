const express = require("express");
const async = require("hbs/lib/async");
const path = require("path");
const app = express();
//const hbs = require("hbs");
var bodyParser = require("body-parser");

require("./src/db/connect");
const Register = require("./src/models/register");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "./public");
// const template_path = path.join(__dirname, "../templates/views");

app.use(express.static(static_path));
//app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/adminp.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public/signin.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public/register.html"));
});

// app.get("/", (req, res) => {
//   res.render("adminp");
// });

// app.get("/login", (req, res) => {
//   res.render("index");
// });

// app.get("/register", (req, res) => {
//   res.render("register");
// });

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.post("/register", (req, res) => {
  const registerEmployee = new Register({
    name: req.body.name,
    email: req.body.email,
    phonenum: req.body.phonenum,
    gender: req.body.gender,
    password: req.body.password,
  });
  registerEmployee
    .save()
    .then(() => {
      res.sendFile(path.join(__dirname, "public/succregister.html"));
    })
    .catch((error) => {
      res.sendFile(path.join(__dirname, "public/error.html"));
    });
});

//login post request
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    // console.log(`email is ${email} and password is ${password}`);
    const useremail = await Register.findOne({ email: email });
    if (useremail.password === password) {
      res.sendFile(path.join(__dirname, "public/success.html"));
    } else {
      res.sendFile(path.join(__dirname, "public/loginerror.html"));
    }
  } catch (error) {
    res.sendFile(path.join(__dirname, "public/loginerror.html"));
  }
});

// app.post("/register", function (req, res) {
//   var name = req.body.name;
//   var email = req.body.email;
//   var phonenum = req.body.phonenum;
//   var gender = req.body.gender;
//   var password = req.body.password;

//   var data = {
//     "name": name,

//     "email": email,
//     "phone": phonenum,
//     "gender": gender,
//     "password": password,
//   };
//   db.collection("details").insertOne(data, function (err, collection) {
//     if (err) throw err;
//     console.log("Record inserted Successfully");
//   });

//   return res.redirect("signup_success.html");
// });

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
