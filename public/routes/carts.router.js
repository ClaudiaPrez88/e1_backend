import { Router } from 'express';
import { CartManager } from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager(); // Instanciamos el manager

// ------------------------------------------------------------------
// 1. POST /api/carts/ - Crear un nuevo carrito
// ------------------------------------------------------------------
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart); // 201 Created
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear el carrito." });
    }
});

// ------------------------------------------------------------------
// 2. GET /api/carts/:cid - Listar productos de un carrito por ID
// ------------------------------------------------------------------
router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    
    try {
        const cart = await cartManager.getCartById(cartId);
        
        if (cart) {
            // El requisito es listar solo los productos que pertenecen al carrito
            res.json(cart.products);
        } else {
            res.status(404).json({ message: `Carrito con ID ${cartId} no encontrado.` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener el carrito." });
    }
});

// ------------------------------------------------------------------
// 3. POST /api/carts/:cid/product/:pid - Agregar producto a carrito
// ------------------------------------------------------------------
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const updatedCart = await cartManager.addProductToCart(cid, pid);

        res.json({
            message: `Producto ${pid} agregado/incrementado en el carrito ${cid}.`,
            cart: updatedCart.products
        });

    } catch (error) {
        console.error("🔥 ERROR REAL:", error); 

        if (error.message.includes('no existe')) {
            return res.status(404).json({ error: error.message });
        }

        if (error.message.includes('no encontrado')) {
            return res.status(404).json({ error: error.message });
        }

        res.status(500).json({ error: "Error al agregar producto al carrito." });
    }
});


export default router;