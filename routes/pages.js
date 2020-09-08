const express = require("express");
const authController = require("../controllers/auth")

const router = express.Router();

router.get("/", (req,res)=>{
    res.render("index");
});

router.get("/register", (req,res)=>{
    res.render("register");
});

router.get("/login", (req,res)=>{
    res.render("login");
});

router.get("/main", authController.isLoggedIn, authController.getBudgets, (req,res)=>{
    if(req.user){
        res.render("main", {
            user: req.user,
            budgets: req.budgets
        });
    } else{
        res.redirect("/login");
    }
});

router.get("/addBudget", authController.isLoggedIn, (req,res)=>{
    if(req.user){
    res.render("addBudget");
    }
    else{
        res.redirect("/login");
    }
});

router.get("/viewBudget",authController.isLoggedIn, authController.viewBudget, (req, res)=>{
    if(req.user){
    res.render("viewBudget",{
        budget: req.budget
    });
    }
    else{
        res.redirect("/login");
    }
})

router.get("/editBudget",authController.isLoggedIn, authController.viewBudget, (req, res)=>{
    if(req.user){
    res.render("editBudget",{
        budget: req.budget
    });
}
    else{
        res.redirect("/login");
    }
})

module.exports = router;