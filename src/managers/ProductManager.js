import { readFile, writeFile } from 'fs/promises';
import crypto from 'crypto';

const PRODUCTS_FILE_PATH = 'products.json';

export class ProductManager {
    constructor() {
        this.path = PRODUCTS_FILE_PATH;
    }

    // Leer productos desde el archivo
    async getProducts() {
        try {
            const data = await readFile(this.path, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT' || error.message.includes('Unexpected end')) {
                return [];
            }
            throw error;
        }
    }

    // Obtener un producto por ID
    async getProductById(productId) {
        const products = await this.getProducts();
        return products.find(p => p.id === productId);
    }

    // Crear un nuevo producto
    async addProduct(productData) {
        const products = await this.getProducts();

        if (!productData.title || !productData.price || !productData.code) {
            throw new Error("Faltan campos obligatorios (title, price, code).");
        }

        const newProduct = {
            id: crypto.randomBytes(12).toString('hex'),
            title: productData.title,
            description: productData.description || "",
            code: productData.code,
            price: productData.price,
            status: productData.status !== undefined ? productData.status : true,
            stock: productData.stock || 0,
            category: productData.category || "Sin Categoría",
            thumbnails: productData.thumbnails || []
        };

        products.push(newProduct);
        await writeFile(this.path, JSON.stringify(products, null, 2));

        return newProduct;
    }

    // Actualizar producto
    async updateProduct(productId, updateData) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === productId);

        if (index === -1) return null;

        const updatedProduct = {
            ...products[index],
            ...updateData,
            id: products[index].id
        };

        products[index] = updatedProduct;
        await writeFile(this.path, JSON.stringify(products, null, 2));

        return updatedProduct;
    }

    // Eliminar producto
    async deleteProduct(productId) {
        let products = await this.getProducts();
        const index = products.findIndex(p => p.id === productId);

        if (index === -1) return null;

        const deletedProduct = products.splice(index, 1)[0];
        await writeFile(this.path, JSON.stringify(products, null, 2));

        return deletedProduct;
    }
}
