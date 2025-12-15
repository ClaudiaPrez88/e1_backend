import { Router } from 'express';
import { ProductManager } from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

// ------------------------------------------------------------------
// GET /api/products/ - Listar todos los productos
// ------------------------------------------------------------------
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error al listar productos." });
    }
});

// ------------------------------------------------------------------
// GET /api/products/:pid - Obtener producto por ID
// ------------------------------------------------------------------
router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (!product) return res.status(404).json({ message: `Producto con ID ${req.params.pid} no encontrado.` });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar producto." });
    }
});

// ------------------------------------------------------------------
// POST /api/products/ - Crear producto
// ------------------------------------------------------------------
router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ------------------------------------------------------------------
// PUT /api/products/:pid - Actualizar producto
// ------------------------------------------------------------------
router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
        if (!updatedProduct) return res.status(404).json({ message: `Producto con ID ${req.params.pid} no encontrado.` });
        res.json({ message: "Producto actualizado", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto." });
    }
});

// ------------------------------------------------------------------
// DELETE /api/products/:pid - Eliminar producto
// ------------------------------------------------------------------
router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await productManager.deleteProduct(req.params.pid);
        if (!deletedProduct) return res.status(404).json({ message: `Producto con ID ${req.params.pid} no encontrado.` });
        res.json({ message: "Producto eliminado", product: deletedProduct });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto." });
    }
});

export default router;
