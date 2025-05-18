const express = require('express');
const cors = require('cors'); // ✅ Add this
const mongoDB = require('./db');
const app = express();
const port = 3000;

// ✅ Use cors middleware
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true // if you're using cookies, else skip this
}));

app.use(express.json());

mongoDB().then(() => {
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.use('/api', require('./Routes/CreateUser')); 
    // Make sure this path is correct
    app.use('/api', require('./Routes/DisplayData'));
    app.use('/api', require('./Routes/OrderData'));

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

}).catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
});
