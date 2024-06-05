const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
const Candidate = require('./models/Candidate');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/recruit_crm', { useNewUrlParser: true, useUnifiedTopology: true });

const generateToken = (user) => {
    return jwt.sign({ userId: user._id }, 'your_jwt_secret');
};

app.post('/api/register', async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
         if (!password) {
             return res.status(400).send('Password is required');
        }
        const password_hash = await bcrypt.hash(password, 10);
        const user = new User({ first_name, last_name, email, password_hash });
        await user.save();
        res.status(201).send('User registered');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password_hash)) {
            const token = generateToken(user);
            res.json({ token });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send('Token is required');
    }
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).send('Invalid token');
    }


app.post('/api/protected', authMiddleware, (req, res) => {
    res.send('Protected route');
});

app.post('/api/candidate', authMiddleware, async (req, res) => {
    try {
        const { first_name, last_name, email } = req.body;
        const candidate = new Candidate({ first_name, last_name, email, user_id: req.userId });
        await candidate.save();
        res.status(201).send('Candidate added');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/candidate', authMiddleware, async (req, res) => {
    try {
        const candidates = await Candidate.find({ user_id: req.userId });
        res.json(candidates);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
