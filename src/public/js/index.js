const socket = io();


// socket.on("evento_socket_individual", data => {
//     console.log(data);
//     const texto = document.getElementById("mensaje_individual");
//     texto.innerHTML = data;
// })

// socket.on("evento_para_todos_menos_socket_actual", data => {
//     console.log(data);
//     const texto = document.getElementById("mensaje_todos_menos_actual");
//     texto.innerHTML = data;
// })

// socket.on("evento_para_todos", data => {
//     console.log(data);
//     const texto = document.getElementById("mensaje_todos");
//     texto.innerHTML = data;
// }) 

// // Escucha todos los mensajes
// socket.on('mensajes', data => {
//     console.log(data);
//     const texto = document.getElementById("texto");
//     if (texto) {
//         const ultimoMensaje = data[data.length - 1]; // obtener el último objeto
//         texto.innerHTML = `${ultimoMensaje.socketId}: ${ultimoMensaje.mensaje}`;
//     }
// });


//socket.on("connect", () => {
//    socket.emit("mensaje", "Hola desde el cliente");
//});
// Escucha mensajes del servidor
// socket.on('mensajes', data => {
//     console.log("Mensaje del servidor:", data);
// });

const enviarMensaje = () =>{
    //Toma el valor emitido en el form 
    const textoInput = document.getElementById("texto").value;
    const texto = textoInput;
    console.log(texto);
    socket.emit("mensaje", texto);
}

//Toma el id #mensajes del documento e imprime el contenido de mensaje
socket.on("mensajes", data => {
    const mensajes = document.getElementById("mensajes");
    let contenido = `<ul class="list-group">`;

    data.forEach(item => {
        contenido += `<li class="list-group-item">${item.socketId}# ${item.mensaje}</li>`;
    });

    contenido += `</ul>`;
    mensajes.innerHTML = contenido;
})