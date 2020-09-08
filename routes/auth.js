const express = require("express"); 
const authController = require("../controllers/auth")

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/addBudget", authController.addBudget);
router.post("/updateBudget", authController.updateBudget);
router.get("/logout", authController.logout);


module.exports = router;