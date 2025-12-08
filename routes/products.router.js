import { Router } from 'express';
import { readFile, writeFile } from 'fs/promises'; 
import crypto from 'crypto'; 

const router = Router();
const archivo = 'products.json'; 

// Función auxiliar para leer el archivo y manejar errores
const getProductsFromFile = async () => {
    try {
        const data = await readFile(archivo, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        // Si el archivo no existe o está vacío, retorna un array vacío
        if (error.code === 'ENOENT' || error.message.includes('Unexpected end')) {
            return []; 
        }
        throw error;
    }
}

// ------------------------------------------------------------------
// 1. GET /api/products/ 
// ------------------------------------------------------------------
router.get('/', async (req, res) => {
    try {
        const products = await getProductsFromFile();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error al listar productos." });
    }
});

// ------------------------------------------------------------------
// 2. GET /api/products/:pid 
// ------------------------------------------------------------------
router.get('/:pid', async (req, res) => {
    const productId = req.params.pid; 
    
    try {
        const products = await getProductsFromFile();
        const product = products.find(p => p.id === productId); 
        
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: `Producto con ID ${productId} no encontrado.` });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al buscar producto." });
    }
});

// ------------------------------------------------------------------
// 3. POST /api/products/ 
// ------------------------------------------------------------------
router.post('/', async (req, res) => {
    const newProductData = req.body; 
    
    // Validar campos requeridos 
    if (!newProductData.title || !newProductData.price || !newProductData.code) {
        return res.status(400).json({ error: "Faltan campos obligatorios (title, price, code)." });
    }

    try {
        const products = await getProductsFromFile();
        
        const newProduct = {
            id: crypto.randomBytes(12).toString('hex'), // ID único autogenerado
            title: newProductData.title,
            description: newProductData.description || "",
            code: newProductData.code,
            price: newProductData.price,
            status: newProductData.status !== undefined ? newProductData.status : true, 
            stock: newProductData.stock || 0,
            category: newProductData.category || "Sin Categoría",
            thumbnails: newProductData.thumbnails || []
        };
        
        products.push(newProduct);
        
        // Guardar el array actualizado
        await writeFile(archivo, JSON.stringify(products, null, 2));
        res.status(201).json(newProduct); 
        
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto." });
    }
});

// ------------------------------------------------------------------
// 4. PUT /api/products/:pid 
// ------------------------------------------------------------------
router.put('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const updateData = req.body;
    
    try {
        let products = await getProductsFromFile();
        const index = products.findIndex(p => p.id === productId);

        if (index === -1) {
            return res.status(404).json({ message: `Producto con ID ${productId} no encontrado.` });
        }

        // Crear el producto actualizado, asegurando NO modificar el 'id'
        const updatedProduct = {
            ...products[index], // Mantener propiedades existentes
            ...updateData,     // Aplicar propiedades enviadas
            id: products[index].id // Sobrescribir para asegurar que el ID original se mantenga
        };

        products[index] = updatedProduct;
        
        await writeFile(archivo, JSON.stringify(products, null, 2));
        
        res.json({ message: `Producto con ID ${productId} actualizado.`, product: updatedProduct });
        
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto." });
    }
});

// ------------------------------------------------------------------
// 5. DELETE /api/products/:pid 
// ------------------------------------------------------------------
router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;
    
    try {
        let products = await getProductsFromFile();
        const initialLength = products.length;

        // Filtrar para crear un nuevo array sin el producto a eliminar
        products = products.filter(p => p.id !== productId);

        if (products.length === initialLength) {
            return res.status(404).json({ message: `Producto con ID ${productId} no encontrado para eliminar.` });
        }
        
        await writeFile(archivo, JSON.stringify(products, null, 2));
        
        res.json({ message: `Producto con ID ${productId} eliminado.` });
        
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto." });
    }
});

export default router;