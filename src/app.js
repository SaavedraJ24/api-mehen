const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');

const connectDB = require('./config/database');
const routes = require('./routes');
const { paths } = require('./config/config');

const app = express();

// DB 
connectDB(); // ÚNICA conexión a MongoDB (no vuelvas a llamar mongoose.connect acá)

// Handlebars
app.engine('hbs', handlebars.engine({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: {
    inc: v => Number(v) + 1,
    dec: v => Number(v) - 1,
    gt: (a, b) => Number(a) > Number(b),
    lt: (a, b) => Number(a) < Number(b),
  }
}));
app.set('view engine', 'hbs');
app.set('views', paths.views); // e.g. src/views

// Middlewares base
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Archivos estáticos
app.use('/public', express.static(paths.public)); // e.g. /public/css/main.css

// Rutas
app.use('/', routes);
const { notFound, errorHandler } = require("./middleware/errorHandler");
app.use(notFound);
app.use(errorHandler);


module.exports = app;
