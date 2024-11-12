const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const app = express();

const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
    .connect("mongodb://127.0.0.1:27017/nodejs-crud")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB Connection Error", err));

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        gender: {
            type: String,
        },
        title: {
            type: String,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("user", userSchema);

app.use((req, res, next) => {
    fs.appendFile(
        "log.txt",
        `\n${Date.now()}: ${req.method} - ${req.url}`,
        (err, data) => {
            next();
        }
    );
});

app.get("/users", async (req, res) => {
    const allDBUsers = await User.find({});

    const html = `<ul>
            ${allDBUsers
                .map((user) => `<li>${user.firstName} - ${user.email}</li>`)
                .join("")}
        </ul>`;

    res.send(html);
});

app.route("/api/users")
    .get(async (req, res) => {
        const allDBUsers = await User.find({});
        res.json(allDBUsers);
    })
    .post(async (req, res) => {
        const body = req.body;

        if (
            !body ||
            !body.first_name ||
            !body.last_name ||
            !body.email ||
            !body.gender ||
            !body.title
        )
            return res.status(400).json({ message: "All fields are required" });

        const userData = await User.create({
            firstName: body.first_name,
            lastName: body.last_name,
            email: body.email,
            gender: body.gender,
            title: body.title,
        });

        res.status(201).json({
            msg: "User created successfully",
            data: userData,
        });
    })
    .patch(async (req, res) => {
        const { id, ...updatedData } = req.body;
        const userIndex = User.findById((user) => user.id === id);

        if (userIndex !== -1) {
            User[userIndex] = { ...User[userIndex], ...updatedData };
            res.json({
                status: "Updated successfully",
                data: User[userIndex],
            });
        } else {
            res.status(404).json({ status: "User not found" });
        }
    })
    .delete(async (req, res) => {
        const { id } = req.body;
        const userIndex = User.findById((user) => user.id === id);

        if (userIndex !== -1) {
            const deletedUser = User.splice(userIndex, 1);
            res.json({ status: "Deleted successfully", data: deletedUser });
        } else {
            res.status(404).json({ status: "User not found" });
        }
    });

app.route("/api/users/:id")
    .get(async (req, res) => {
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ status: "User not found" });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ status: "User not found" });
        }
    })
    .patch(async (req, res) => {
        const user = await User.findByIdAndUpdate(req.params.id, {
            lastName: "Changed",
        });

        return res.status(200).json({
            msg: "Updated successfully",
            data: user,
        });
    })
    .delete(async (req, res) => {
        await User.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            msg: "Deleted successfully",
        });
    });

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});
