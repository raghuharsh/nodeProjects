const mongoose = require('mongoose');


mongoose.connect("mongodb://localhost:27017/registratioinForm", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    }).then(() => console.log('connection successfull....')) //return promises
    .catch((err) => console.log(err));