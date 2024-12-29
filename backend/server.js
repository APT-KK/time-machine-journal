const express = require('express');

const port = 8000;
const app = express();

// Middleware 
app.use(express.json());


// routes
app.get('/', (req, res) => {
    res.send('Welcome to server - backend!');
});

// Listen
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

