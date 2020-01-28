import express from 'express';
import connectDatabase from './config/db';
import { check, validationResult } from 'express-validator';
import cors from 'cors';

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

app.post(
    '/api/users', 
    [
        check('name', 'Please enter your username').not().isEmpty(),
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Please enter a password with a minimum of 8 or more characters').isLength({ min: 6 })
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            return res.send(req.body);
        }
    }
);

// Connection listener
const port = process.env.port || 5000;
app.listen(port, () => console.log(`Express server running on port ${port}`));