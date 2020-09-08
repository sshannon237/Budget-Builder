const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
    promisify
} = require("util");

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB
});

exports.register = (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    db.query("SELECT users_email FROM users WHERE users_email = ?", [email], async (err, results) => {
        if (err) {
            console.log(err.message)
        }
        if (results.length > 0) {
            return res.render("register", {
                message: "An account with that email already exists"
            });
        } else if (password != confirmPassword) {
            return res.render("register", {
                message: "The passwords do not match"
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        db.query("INSERT INTO users SET ?", {
            users_name: name,
            users_email: email,
            users_password: hashedPassword
        }, (err, results) => {
            if (err) {
                console.log(err.message)
            }
        })

        db.query("SELECT * FROM users WHERE users_email = ?", [email], async (err, results) => {
            if (results[0]==undefined || !(await bcrypt.compare(password, results[0].users_password))) {
                res.status(401).render("login", {
                    message: "The email or the password is incorrect"
                });
            } else {
                const id = results[0].users_id;

                const token = jwt.sign({
                    id: id
                }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie("jwt", token, cookieOptions);
                res.status(200).redirect("/main");
            }
        });

    });
}

exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).render("login", {
                message: "Please provide an email and a password"
            });
        }

        db.query("SELECT * FROM users WHERE users_email = ?", [email], async (err, results) => {
            if (results[0]==undefined || !(await bcrypt.compare(password, results[0].users_password))) {
                res.status(401).render("login", {
                    message: "The email or the password is incorrect"
                });
            } else {
                const id = results[0].users_id;

                const token = jwt.sign({
                    id: id
                }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie("jwt", token, cookieOptions);
                res.status(200).redirect("/main");
            }
        });

    } catch (error) {
        console.log(error);
    }
}

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt,
                process.env.JWT_SECRET);
            db.query("SELECT * FROM users WHERE users_id = ?", [decoded.id], (error, result) => {

                if (!result) {
                    return next();
                }

                req.user = result[0];
                return next();
            })
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        next();
    }
};

exports.logout = async (req, res) => {
    res.cookie("jwt", "logout", {
        expires: new Date(Date.now() + 2*1000),
        httpOnly: true
    })

    res.status(200).redirect("/");
};

exports.getBudgets = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt,
                process.env.JWT_SECRET);
            db.query("SELECT budgets_name, budgets_id, budgets_date FROM budgets WHERE users_id = ?", [decoded.id], (error, result) => {
                if (!result) {
                    return next();
                }

                req.budgets = result;
                return next();
            })
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        next();
    }
}

exports.viewBudget = async (req, res, next) => {
    try {
        let decoded;
        try {
            decoded = await promisify(jwt.verify)(req.cookies.jwt,
                process.env.JWT_SECRET);
        } catch (error) {
            console.log(error);
        }

        const budget = req.query.budget;
        db.query("SELECT * FROM budgets WHERE budgets_name = ? AND users_id = ?", [budget, decoded.id], (error, result) => {
            req.budget = result[0];
            return next();
        })
    } catch (error) {
        console.log(error);
        return next();
    }
}

exports.addBudget = async (req, res) => {

    let decoded;

    const name = req.body.name;
    const income = req.body.income;
    const transportation = req.body.transportation;
    const housing = req.body.housing;
    const groceries = req.body.groceries;
    const other_food = req.body.other_food;
    const savings = req.body.savings;
    const other = req.body.other;

    try {
        decoded = await promisify(jwt.verify)(req.cookies.jwt,
            process.env.JWT_SECRET);
    } catch (error) {
        console.log(error);
    }
    db.query("SELECT budgets_name FROM budgets WHERE budgets_name = ? AND users_id = ?", [name, decoded.id], async (err, results) => {
        if (err) {
            console.log(err.message)
        }
        if (results.length > 0) {
            return res.status(400).render("addBudget", {
                message: "A budget with that name already exists"
            });
        }
        if (name.trim().length == 0) {
            return res.status(400).render("addBudget", {
                message: "Please enter a name"
            });
        }

        db.query("INSERT INTO budgets SET ?", {
            budgets_name: name,
            users_id: decoded.id,
            budgets_income: income,
            budgets_housing: housing,
            budgets_transportation: transportation,
            budgets_groceries: groceries,
            budgets_eating_out: other_food,
            budgets_savings: savings,
            budgets_other: other
        }, (err, results) => {
            if (err) {
                console.log(err.message)
            }
        })
        res.status(200).redirect("/main");
    });
}

exports.updateBudget = async (req, res) => {

    let decoded;

    const name = req.body.name;
    const income = req.body.income;
    const transportation = req.body.transportation;
    const housing = req.body.housing;
    const groceries = req.body.groceries;
    const other_food = req.body.other_food;
    const savings = req.body.savings;
    const other = req.body.other;

    try {
        decoded = await promisify(jwt.verify)(req.cookies.jwt,
            process.env.JWT_SECRET);
    } catch (error) {
        console.log(error);
    }
    db.query("SELECT budgets_name FROM budgets WHERE budgets_name = ? AND users_id = ?", [name, decoded.id], async (err, results) => {
        if (err) {
            console.log(err.message)
        }
        if (results.length > 0 && results[0].budgets_name != name) {
            return res.status(400).render("editBudget", {
                message: "A budget with that name already exists",
                budget: {
                    budgets_name: name,
                    users_id: decoded.id,
                    budgets_income: income,
                    budgets_housing: housing,
                    budgets_transportation: transportation,
                    budgets_groceries: groceries,
                    budgets_eating_out: other_food,
                    budgets_savings: savings,
                    budgets_other: other
                }
            });
        }
        if (name.trim().length == 0) {
            return res.status(400).render("editBudget", {
                message: "Please enter a name",
                budget: {
                    budgets_name: name,
                    users_id: decoded.id,
                    budgets_income: income,
                    budgets_housing: housing,
                    budgets_transportation: transportation,
                    budgets_groceries: groceries,
                    budgets_eating_out: other_food,
                    budgets_savings: savings,
                    budgets_other: other
                }
            });
        }
        db.query("UPDATE budgets SET ? WHERE budgets_id = ?",[{
            budgets_name: name,
            users_id: decoded.id,
            budgets_income: income,
            budgets_housing: housing,
            budgets_transportation: transportation,
            budgets_groceries: groceries,
            budgets_eating_out: other_food,
            budgets_savings: savings,
            budgets_other: other
        },req.query.id], (err, results) => {
            if (err) {
                console.log(err.message)
            }
        })
        res.status(200).redirect("/viewBudget?budget="+name);
    });
}