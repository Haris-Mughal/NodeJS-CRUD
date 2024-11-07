const express = require("express");
const fs = require("fs");
const path = require("path");
const users = require("./MOCK_DATA.json");
const app = express();

const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    req.mw = "Middleware";
    console.log(`Hello, ${req.mw}!`);
    next();
});

app.use((req, res, next) => {
    fs.appendFile(
        "log.txt",
        `\n${Date.now()}: ${req.method} - ${req.path}`,
        (err, data) => {
            next();
        }
    );
});

app.use((req, res, next) => {
    console.log(`Bye, ${req.mw}!`);
    next();
});

const writeToFile = (data, res) => {
    fs.writeFile(
        path.join(__dirname, "MOCK_DATA.json"),
        JSON.stringify(data, null, 2),
        (err) => {
            if (err) {
                return res.status(500).json({ status: "Failed to write data" });
            }
        }
    );
};

app.route("/api/users")
    .get((req, res) => {
        console.log(req.headers);

        res.setHeader("X-myName", "Haris");

        res.json(users);
    })
    .post((req, res) => {
        const newUser = { id: users.length + 1, ...req.body };
        users.push(newUser);
        writeToFile(users, res);
        res.status(201).json({ status: "Success", data: newUser });
    })
    .patch((req, res) => {
        const { id, ...updatedData } = req.body;
        const userIndex = users.findIndex((user) => user.id === Number(id));

        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updatedData };
            writeToFile(users, res);
            res.json({
                status: "Updated successfully",
                data: users[userIndex],
            });
        } else {
            res.status(404).json({ status: "User not found" });
        }
    })
    .delete((req, res) => {
        const { id } = req.body;
        const userIndex = users.findIndex((user) => user.id === Number(id));

        if (userIndex !== -1) {
            const deletedUser = users.splice(userIndex, 1);
            writeToFile(users, res);
            res.json({ status: "Deleted successfully", data: deletedUser });
        } else {
            res.status(404).json({ status: "User not found" });
        }
    });

app.route("/api/users/:id").get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ status: "User not found" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});
