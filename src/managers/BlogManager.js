//lógica interna que maneja los posts: leerlos, escribirlos, editarlos, borrarlos - manipulación de datos
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// reconstruimos __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ruta absoluta al JSON del blog
const BLOG_FILE_PATH = path.join(__dirname, '../data/blog.json');

export class BlogManager {

  constructor() {
    this.path = BLOG_FILE_PATH;
  }

  // --------------------------------------------------
  // Leer todos los posts
  // --------------------------------------------------
  async getPosts() {
    try {
      const data = await readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  // --------------------------------------------------
  // Obtener post por ID
  // --------------------------------------------------
  async getPostById(postId) {
    const posts = await this.getPosts();
    return posts.find(p => p.id === Number(postId));
  }

  // --------------------------------------------------
  // Crear nuevo post (ID incremental seguro)
  // --------------------------------------------------
  async addPost(postData) {
    const posts = await this.getPosts();

    if (!postData.title || !postData.subtitle || !postData.description || !postData.tag || !postData.image) {
      throw new Error('Faltan campos obligatorios (title, subtitle, description, tag, image)');
    }

    // obtener ID máximo
    const maxId = posts.reduce(
      (max, post) => post.id > max ? post.id : max,
      0
    );

    const newPost = {
      id: maxId + 1,
      date: new Date().toISOString(),
      tag: postData.tag,
      title: postData.title,
      subtitle: postData.subtitle,
      description: postData.description,
      image: postData.image || ''
    };

    posts.push(newPost);
    await writeFile(this.path, JSON.stringify(posts, null, 2));

    return newPost;
  }

  // --------------------------------------------------
  // Actualizar post
  // --------------------------------------------------
  async updatePost(postId, updateData) {
    const posts = await this.getPosts();
    const index = posts.findIndex(p => p.id === Number(postId));

    if (index === -1) return null;

    posts[index] = {
      ...posts[index],
      ...updateData,
      id: posts[index].id // no permitir cambiar ID
    };

    await writeFile(this.path, JSON.stringify(posts, null, 2));
    return posts[index];
  }

  // --------------------------------------------------
  // Eliminar post
  // --------------------------------------------------
  async deletePost(postId) {
    const posts = await this.getPosts();
    const index = posts.findIndex(p => p.id === Number(postId));

    if (index === -1) return null;

    const [deleted] = posts.splice(index, 1);
    await writeFile(this.path, JSON.stringify(posts, null, 2));

    return deleted;
  }
}
