const { default: axios } = require('axios');
const express = require('express');
const http = require('http');
const app = express();
const mainRouter = require('./routes/mainRouters');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(mainRouter);






app.listen(process.env.PORT || 3000, () => {
    console.log('Server is listening port 3000')
}); 