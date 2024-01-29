const express = require('express');
const app = express();
require('dotenv').config();
const PORT = 3000;
const contactRoute = require('./Routers/contactRoute.js');
 
// middlewares
app.use(express.json());
app.use('/contact', contactRoute);

// listening to the port - 3000
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
})

