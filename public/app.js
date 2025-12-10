import express from 'express';

import productsRouter from './routes/products.router.js'; 
import cartsRouter from './routes/carts.router.js';

const app = express();
const port = 8080;


// Middleware peticiones POST y PUT
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Router
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta de raíz 
app.get('/', (req, res) => {
    res.send("Bienvenido a la API de E-commerce!");
});

app.listen(port, () => {
    console.log(`Servidor arriba en el puerto ${port}!`);
});