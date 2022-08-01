const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const Handler = require("../models/Handler.model");
const { isAuthenticated } = require("../middleware/jwt.middlware")

const saltRounds = 10;

// Create a new Handler account
router.post('/signup', (req, res, next) => {

    const { firstName, lastName, email, password } = req.body;

    if (email === '' || password === '' || firstName ==='' || lastName === '') {
        res.status(400).json({message: "Please provide a full name, email and password"});
        return;
    }
    
    // using regex to validate the email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Please provide a valid email address'});
        return;
    }

    // using regez to validate the password too
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
        res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.'});
        return;
    }
    
    // now we're checking if the same email exists
    Handler.findOne({ email })
        .then((foundHandler) => {
            //if email address is founf
            if (foundHandler) {
                res.status(400).json({ message: "Account already exists." });
                return;
            }
            // if email address is good to go
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);

            // now creating the handler's account
            return Handler.create({ firstName, lastName, email, password: hashedPassword });
        })
            .then((createdHandler) => {
                const { firstName, lastName, email, _id } = createdHandler;
                const handler = { firstName, lastName, email, _id };
                res.status(201).json({ handler: handler});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Interval Server Error"})
        });
});

//Now the login route
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    //first checking if inputs are empty
    if (email === '' || password === '') { 
        res.status(400).json({ message: "please provide a valid email and password."});
        return;
    }

    // now let's look for the email in the database
    Handler.findOne({ email })
        .then((foundHandler) => {
            if (!foundHandler) {
                //meaning no user found
                res.status(401).json({ message: "User not found."});
                return;
            }

            // comparing the passsword given with the database
            const passswordCorrect = bcrypt.compareSync(password, foundHandler.password);

            if (passswordCorrect) {
                //deconstruct info from database
                const { _id, firstName, lastName, email } = foundHandler;
                //created object for the token
                const payload = { _id, firstName, lastName, email };
                //create and sign the token
                const authToken = jwt.sign (
                    payload,
                    process.env.TOKEN_SECRET, 
                    { algorithm: 'HS256', expiresIn: "8h" }
                );

            //now we send the token as a response
            res.status(200).json({ authToken: authToken});
            }
        else {
            res.status(401).json({ message: "Unable to authenticate the handler" });
        }
        })
        .catch(err => res.status(500).json ({ message: "Internal Server Error"}));
});

//route to verify the token stores on the client 
router.get('/verify', isAuthenticated, (req, res, next) => {
    console.console.log(`req.payload`, req.payload);
}); 


module.exports = router;