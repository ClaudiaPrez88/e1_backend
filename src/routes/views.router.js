//Inicio express
import express from "express";

const viewsRouter = express.Router();

viewsRouter.get("/", (req, res) => {
    res.render("index", {title:"Chat con Websocket"});
})


export default viewsRouter