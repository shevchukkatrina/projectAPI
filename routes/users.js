const { usersController } = require("../controllers");
const express = require("express");

const router = express.Router();

router.get("/", usersController.getAllUsers);
router.get("/:id", usersController.getUser);
router.post("/", usersController.createUser);
router.put("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);

module.exports = router;
