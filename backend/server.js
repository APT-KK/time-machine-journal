const express = require('express');
const cors = require('cors');
const authRouter = require('./Routes/AuthRouter');
const port = 8001;
const app = express();
require('./Models/DataBase');

// Middlewares
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get('/', (req, res) => {
    res.send('Welcome to server - backend!');
});


app.use('/api/auth', authRouter);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke internally - My Bad!');
});

// Listen
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

