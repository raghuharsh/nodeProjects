require('dotenv').config();
const express = require("express");
require("./db/conn");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");


const Register = require("./models/userRegistration")

const port = process.env.PORT || 3001;

const static_path = path.join(__dirname, "../public");

const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());

app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

console.log(process.env.SECRET_KEY)
app.get("/", (req, res) => {

    res.render("index")

})

app.get("/home", (req, res) => {


    console.log("cookie info", req.cookies.jwt);
    // console.log("cookie info 2", cookies);
    res.render("home")

})

app.get("/register", (req, res) => {
    res.render("registrationForm")
})

// const securePassword = async(password) => {
//     const passHash = await bcrypt.hash(password, 10);
//     console.log(passHash);
//     const passmatch = await bcrypt.compare(password, passHash);
//     console.log(passmatch);
// }
// securePassword("Raghu");
app.post("/register", async(req, res) => {
    const user = new Register(req.body);
    console.log(req.body);

    try {
        const pass = req.body.password;
        const confirmpass = req.body.confirmPassword;

        if (pass == confirmpass) {
            const token = await user.generateToken();
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 3000),
                httpOnly: true,
                // secure:true
            });
            console.log(cookie);
            const createUser = await user.save();
            res.status(201).render("index");
        } else {
            res.status(500).render("error");
        }
        console.log(req.body);
    } catch (e) {
        res.status(401).send(e);
        console.log(e)
    }
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", async(req, res) => {
    console.log(req.body);

    try {
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await Register.findOne({ email: email });
        const passmatch = await bcrypt.compare(password, useremail.password);
        const token = await useremail.generateToken();
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 30000),
            httpOnly: true,
            // secure:true
        });
        if (passmatch) {
            res.status(201).render("index");
        } else { res.send("invalid login details") }
    } catch (e) { res.status(401).send(e) }
})

app.use(express.static(static_path));




app.listen(port, () => {
    console.log(`connection is live at port: ${port}`)
})