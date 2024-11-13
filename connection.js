const mongoose = require("mongoose");

async function connectDb(url) {
    return mongoose
        .connect(url)
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.error("MongoDB Connection Error", err));
}

module.exports = {
    connectDb,
};
