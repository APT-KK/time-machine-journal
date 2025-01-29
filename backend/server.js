const express = require('express');
const cors = require('cors');
const authRouter = require('./Routes/authRouter');
const entryRouter = require('./Routes/entryRouter');
const BotRouter = require('./Routes/BotRouter');;
const wordCloudRouter = require('./Routes/wordCloudRouter');
const mapRouter = require('./Routes/MapRouter');
const cookieParser = require('cookie-parser');
const port = 8000;
const app = express(); 

require('./Models/DataBase');

require('dotenv').config();


// Middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.get('/', (req, res) => {
    res.send('Welcome to server - backend!');
});


app.use('/api/auth', authRouter);

app.use('/api/entries', entryRouter);

app.use('/api/bot', BotRouter);

app.use('/api/wordcloud', wordCloudRouter);

app.use('/api/map', mapRouter);

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Listen
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

