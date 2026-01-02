
//declaro las rutas principales
import express from 'express';
import handlebars from "express-handlebars";
import viewsRouter from './routes/views.router.js';
import __dirname from './utils.js';
import {Server} from 'socket.io';

import productsRouter from './routes/products.router.js'; 
import cartsRouter from './routes/carts.router.js';
import blogRouter from './routes/blog.router.js';


const app = express();
const port = 8080;


// Middleware peticiones POST y PUT - Estas dos líneas nos permiten caputurar los datos desde el BODY a un POST
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
//Ruta principal
app.use('/', express.static(__dirname + '/public'));

//Handlebars
app.engine('handlebars',handlebars.engine({extname: '.handlebars', defaultLayout: 'main'}));
app.set('view engine','handlebars');
app.set('views',__dirname + '/views');

// Declaración de rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/blog', blogRouter);

//Rutas para visitas de Handlebars
app.use('/viewsrouter', viewsRouter);
app.use('/prueba',(req,res) => {
    res.render('prueba');
})

// Servidor HTTP + Socket.io
const httpServer = app.listen(port, () => console.log(`Servidor listo en puerto ${port}`));
const socketServer = new Server(httpServer);

// Socket.io
const mensajes = [];
socketServer.on('connection', socket => {
    const generarId = () => mensajes.length + 1;

    socket.on('mensaje', data => {
        const nuevoMensaje = { socketId: generarId(), mensaje: data };
        mensajes.push(nuevoMensaje);
        socketServer.emit('mensajes', mensajes); // envía a todos los clientes
    });
});


// Configuración HBS
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');




// Ruta de raíz 
//app.get('/', (req, res) => {
//    res.send("Bienvenido a la API de E-commerce!");
//});

//app.listen(port, () => {
 //   console.log(`Servidor arriba en el puerto ${port}!`);
//});