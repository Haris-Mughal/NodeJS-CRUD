const express = require("express");
const { connectDb } = require("./connection");

const userRouter = require("./routes/user");
const { logReqRes } = require("./middlewares");

const app = express();
const PORT = 8000;

connectDb("mongodb://127.0.0.1:27017/nodejs-crud");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logReqRes("log.txt"));

app.use("/api/users", userRouter);

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});
