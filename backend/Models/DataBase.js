const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Loading environment variables
dotenv.config();

//MongoDB Connection
mongoose.connect(process.env.MONGODB_URI ,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(() => {
    console.log('MongoDB Connected!');
}).catch((err) => {
    console.log('MongoDB errored out!' , err);
});

module.exports = mongoose;

