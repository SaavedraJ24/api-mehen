const express = require('express');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const connectDB = require("./database");
const routes = require('./routes');
const { paths, MONGO_URI } = require('./config/config');

const app = express();

// Conectar a Mongo
connectDB();

// --- MongoDB Atlas ---
mongoose.connect(MONGO_URI)
  .then(() => console.log('[db] MongoDB connected'))
  .catch((err) => console.error('[db] connection error:', err));

// --- Handlebars ---
app.engine('hbs', handlebars.engine({
  extname: '.hbs',
  defaultLayout: 'main',
}));
app.set('view engine', 'hbs');
app.set('views', paths.views);

// --- Middlewares base ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// --- Estáticos ---
app.use('/public', express.static(paths.public));

// --- Rutas demo de vistas (asegurate de tener los .hbs) ---
app.get('/', (req, res) => res.render('pages/home'));
app.get('/login', (req, res) => res.render('pages/login'));

const products = [
  {
    id: '1',
    title: 'El Hobbit',
    author: 'J.R.R. Tolkien',
    description: 'Bilbo Bolsón, un hobbit tranquilo...',
    code: 'FAN-001',
    price: 12.99,
    status: true,
    stock: 20,
    category: 'Fantasía',
    thumbnail: '/public/yo.jpg', // <-- ojo el path
  },
  {
    id: '2',
    title: 'Harry Potter y la Piedra Filosofal',
    author: 'J.K. Rowling',
    description: 'Primera entrega de la saga.',
    code: 'FAN-002',
    price: 12.50,
    status: true,
    stock: 40,
    category: 'Fantasía',
    thumbnail: '/public/yo.jpg',
  }
];

app.get('/store', (req, res) => {
  res.render('pages/store', { products });
});

app.use("/", routes);


module.exports = app;
