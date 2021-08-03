const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//securing password upto 10 times bcrypting (max 14)
userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmPassword = await bcrypt.hash(this.password, 10);
    }
    // this.confirmPassword = undefined;
    console.log(this.password);
    next();
})

userSchema.methods.generateToken = async function() {
    try {
        const token = await jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY, { expiresIn: "2 minutes" });
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
        // const userVerify = jwt.verify(token, "secretKey32Characterlong");
        // console.log(userVerify);

    } catch (e) {
        res.send("error page" + e);
    }
}

const Register = new mongoose.model("Register", userSchema);

module.exports = Register;