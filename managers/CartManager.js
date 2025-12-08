
//Controladores de Datos 
//Contiene todas las operaciones de CRUD (Crear, Reer, Update, Delete)

import { readFile, writeFile } from 'fs/promises';
import crypto from 'crypto'; 
const CARTS_FILE_PATH = 'carts.json';


export class CartManager {

    constructor() {
        this.path = CARTS_FILE_PATH;
    }

    async getProducts() {
    try {
        const data = await readFile(PRODUCTS_FILE_PATH, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}


    // Función auxiliar para leer el archivo y retornar el array de carritos
    async getCarts() {
        try {
            const data = await readFile(this.path, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            // Si el archivo no existe o está vacío, retorna un array vacío
            if (error.code === 'ENOENT' || error.message.includes('Unexpected end')) {
                return []; 
            }
            throw error;
        }
    }

    // Guardar el array de carritos en el archivo
    async saveCarts(carts) {
        await writeFile(this.path, JSON.stringify(carts, null, 2));
    }

    // -----------------------------------------------------------
    // POST /api/carts/
    // -----------------------------------------------------------
    async createCart() {
        const carts = await this.getCarts();
        
        const newCart = {
            id: crypto.randomBytes(12).toString('hex'), // ID único autogenerado
            products: [] 
        };
        
        carts.push(newCart);
        await this.saveCarts(carts);
        
        return newCart;
    }

    // -----------------------------------------------------------
    // GET /api/carts/:cid
    // -----------------------------------------------------------
    async getCartById(cartId) {
        const carts = await this.getCarts();
        return carts.find(c => c.id === cartId);
    }

    // -----------------------------------------------------------
    // POST /api/carts/:cid/product/:pid
    // -----------------------------------------------------------
    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        
        const cartIndex = carts.findIndex(c => c.id === cartId);
        if (cartIndex === -1) {
            throw new Error(`Carrito con ID ${cartId} no encontrado.`);
        }

        // Validar si el producto existe
        const products = await this.getProducts();
        const productExists = products.some(p => p.id === productId);

        if (!productExists) {
            throw new Error(`Producto con ID ${productId} no existe.`);
        }

        const cart = carts[cartIndex];
         // 3. Agregar o incrementar cantidad
        const existing = cart.products.findIndex(p => p.product === productId);

        if (existing !== -1) {
            // Caso 1: El producto ya existe -> Incrementar quantity
            cart.products[existing].quantity += 1;
        } else {
            // Caso 2: El producto es nuevo -> Agregar con quantity 1
            cart.products.push({
                product: productId,
                quantity: 1
            });
        }
        
        // Actualizar el array de carritos en la memoria y guardar en el archivo
        await this.saveCarts(carts);

        return cart;
    }
}