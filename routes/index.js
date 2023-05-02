const { Router } = require("express");
const { userAuth } = require("../middlewares/auth");

const {
    getUsers,
    createUser,
    deleteUser,
    updateUser,
    userLogin,
    logoutUser,
} = require("../controller");

const router = Router();

// user operations routes
router.get("/user/get-user",userAuth, getUsers);
router.post("/user/create-user",userAuth, createUser);
router.delete("/user/delete-user/:uuid",userAuth, deleteUser);
router.patch("/user/update-user/:uuid",userAuth, updateUser);
router.post("/user/login-user", userLogin);
router.get("/user/logout-user", logoutUser);

module.exports = router;