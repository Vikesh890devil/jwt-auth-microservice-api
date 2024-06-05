const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const Candidate = require('./models/Candidate');
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/recruit_crm', { useNewUrlParser: true, useUnifiedTopology: true });

const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.header('x-api-key');
    if (apiKey === 'your_api_key') {
        next();
    } else {
        res.status(401).send('Invalid API key');
    }
};

app.post('/api/public/profile', apiKeyMiddleware, async (req, res) => {
    const user = await User.findById('user_id_associated_with_api_key');
    res.json(user);
});

app.get('/api/public/candidate', apiKeyMiddleware, async (req, res) => {
    const candidates = await Candidate.find({ user_id: 'user_id_associated_with_api_key' });
    res.json(candidates);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Public API running on port ${PORT}`));
