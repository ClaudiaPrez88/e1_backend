
//declaro las rutas principales
import express from 'express';
import handlebars from "express-handlebars";
import viewsRouter from './routes/views.router.js';
import __dirname from './utils.js';
import {Server} from 'socket.io';
import path from 'path';

const app = express();
const port = 8080;


// Middleware peticiones POST y PUT - Estas dos líneas nos permiten caputurar los datos desde el BODY a un POST
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
//Crea la ruta para que pueda leer los archivos dentro de public
app.use(express.static(path.join(__dirname, 'public')));
//Ruta principal

//Handlebars
app.engine('handlebars',handlebars.engine({extname: '.handlebars', defaultLayout: 'main'}));
app.set('view engine','handlebars');
app.set('views',__dirname + '/views');


//Rutas para visitas de Handlebars
app.use('/viewsrouter', viewsRouter);

// Servidor HTTP + Socket.io
const httpServer = app.listen(port, () => console.log(`Servidor listo en puerto ${port}`));
const socketServer = new Server(httpServer);

// Socket.io
const mensajes = [];

socketServer.on('connection', socket => {
    // socket.emit("evento_socket_individual", "Mensaje individual");
    // socket.broadcast.emit("evento_para_todos_menos_socket_actual", "Mensaje para todos menos el actual");
    // socketServer.emit("evento_para_todos", "Mensaje para Todos!"); 

    const generarId = () => mensajes.length + 1;
    socket.on('mensaje', data => {
        const nuevoMensaje = { socketId: generarId(), mensaje: data };
        mensajes.push(nuevoMensaje);
        socketServer.emit('mensajes', mensajes); // envía a todos los clientes
        });
});


// Ruta de raíz 
//app.get('/', (req, res) => {
//    res.send("Bienvenido a la API de E-commerce!");
//});

//app.listen(port, () => {
 //   console.log(`Servidor arriba en el puerto ${port}!`);
//});