const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getUser,
} = require("../controllers/user");

router.route("/").get(getAllUsers).post(createNewUser);
// .patch(updateUser)
// .delete(deleteUser);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
