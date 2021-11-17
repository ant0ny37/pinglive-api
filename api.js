require('dotenv').config();

const server = require('http');
const express = require('express');
const packageJson = require('./package.json');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();
app.set('trust proxy', true);

const port = 8080

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(function (req, res, next) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    next();
});

const http = server.createServer(app);

http.listen(port, () => {
    console.log(`"${packageJson.name}" started on ${port}`)
});

// STATIC FOLDERS
app.use('/medias/', express.static('./public'));

// ROUTES
app.use(routes);

app.use((req, res, next) => {
    const error = new Error('404 Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        result: false,
        error: error.message
    });
});