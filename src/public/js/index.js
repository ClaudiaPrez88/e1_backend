const socket = io();

socket.on("connect", () => {
    console.log("Cliente conectado con ID:", socket.id);
    socket.emit("mensaje", "Hola desde el cliente");
});


// Escucha el evento que realmente emite el servidor
socket.on('mensajes', data => {
    console.log(data);
    const texto = document.getElementById("texto");
    if (texto) {
        const ultimoMensaje = data[data.length - 1]; // obtener el último objeto
        texto.innerHTML = `${ultimoMensaje.socketId}: ${ultimoMensaje.mensaje}`;
    }
});