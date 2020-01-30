import express from 'express';
import connectDatabase from './config/db';
import { check, validationResult } from 'express-validator';
import cors from 'cors';
import User from './models/User';
import bcrypt from 'bcryptjs';

// Initialize express application
const app = express();

// Connect database
connectDatabase();

// Configure Middleware
app.use(express.json({ extended: false }));
app.use(
    cors({
        origin: 'http://localhost:3000'
    })
);

// API endpoints
app.get('/', (req, res) => 
    res.send('http get request send to root api endpoint')
);

/**
 * @route POST api/Users
 * @desc Register user
 */
app.post(
    '/api/users', 
    [
        check('name', 'Please enter your username').not().isEmpty(),
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Please enter a password with a minimum of 8 or more characters').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            const { name, email, password } = req.body;
            // Check if user exists
            try {
                let user = await User.findOne({ email: email });
                if (user) {
                    return res
                    .status(400)
                    .json({ errors: [{ msg: 'This email is already taken' }] });
                }

                // Create a new user
                user = new User({
                    name: name,
                    email: email,
                    password: password
                });

                // Encrypt the password
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);

                // Save to the db and return
                await user.save();
                res.send('User successfully registered');
            } catch (error) {
                res.status(500).send('Server error');
            }
        }
    }
);

// Connection listener
const port = 5000;
app.listen(port, () => console.log(`Express server running on port ${port}`));