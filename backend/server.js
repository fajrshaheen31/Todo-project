const express = require('express');
const todosRoute = require('./src/routes/todos');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/todos', todosRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
