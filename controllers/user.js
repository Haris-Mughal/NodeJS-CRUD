const User = require("../models/user");

async function getAllUsers(req, res) {
    const allDBUsers = await User.find({});

    // const html = `<ul>
    //         ${allDBUsers
    //             .map((user) => `<li>${user.firstName} - ${user.email}</li>`)
    //             .join("")}
    //     </ul>`;

    // res.send(html);
    res.json(allDBUsers);
}
async function createNewUser(req, res) {
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
}

async function updateUser(req, res) {
    //WEB.........
    // const { id, ...updatedData } = req.body;
    // const userIndex = User.findById((user) => user.id === id);

    // if (userIndex !== -1) {
    //     User[userIndex] = { ...User[userIndex], ...updatedData };
    //     res.json({
    //         status: "Updated successfully",
    //         data: User[userIndex],
    //     });
    // } else {
    //     res.status(404).json({ status: "User not found" });
    // }

    //TEST.........
    const user = await User.findByIdAndUpdate(req.params.id, {
        email: "good@example.com",
    });

    return res.status(200).json({
        msg: "Updated successfully",
        data: user,
    });
}

async function deleteUser(req, res) {
    // const { id } = req.body;
    // const userIndex = User.findById((user) => user.id === id);

    // if (userIndex !== -1) {
    //     const deletedUser = User.splice(userIndex, 1);
    //     res.json({ status: "Deleted successfully", data: deletedUser });
    // } else {
    //     res.status(404).json({ status: "User not found" });
    // }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
        msg: "Deleted successfully",
    });
}

async function getUser(req, res) {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ status: "User not found" });

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ status: "User not found" });
    }
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getUser,
};
