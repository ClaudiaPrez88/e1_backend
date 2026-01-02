
//Archivo que define las rutas de la API. Como voy a interactuar (aquí incluyo la llamada a los managers)
import { Router } from 'express';
import { BlogManager } from '../managers/BlogManager.js';
import { uploader } from '../utils.js';

const router = Router();
const blogManager = new BlogManager();



// ----------------------------------------
// GET /api/blog DE TODOS LOS artículos
// ----------------------------------------
router.get('/', async (req, res) => {
  try {
    const posts = await blogManager.getPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los posts del blog' });
  }
});

// ----------------------------------------
// GET /api/blog/:id  TRAE LOS ARTÍCULOS POR EL ID ESPECIFICO
// ----------------------------------------
router.get('/:id', async (req, res) => {
  try {
    const post = await blogManager.getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });
    res.json(post);
  } catch (error) {
    console.error('Error en GET /api/blog/:id ->', error);
    res.status(500).json({ error: 'Error al obtener el post' });
  }
});


// ----------------------------------------
// POST /api/blog
// ----------------------------------------
router.post('/', uploader.single('image'), async (req, res) => {
  
  try {
    const { title, subtitle, tag, description } = req.body;
    // Si NO hay imagen subida, usar img default
    const image = req.file ? req.file.filename : 'img/img.png';

    const nuevoPost = await blogManager.addPost({title, tag,subtitle, description, image});
    res.status(201).json(nuevoPost);
  } catch (error){
    res.status(500).json({error:error.message});
  }

})

// ----------------------------------------
// DELETE /api/blog
// ----------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await blogManager.deletePost(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Post no encontrado' });
    res.json({ message: 'Post eliminado', post: deleted });
  } catch (error) {
    console.error('Error en DELETE /api/blog/:id ->', error);
    res.status(500).json({ error: 'Error al eliminar el post' });
  }
});

// ----------------------------------------
//PUT /api/blog/:id → actualiza un post
// ----------------------------------------
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { title, tag, description, image } = req.body;

  try {
    const updatedPost = await blogManager.updatePost(id, { title, tag, description, image });
    if (!updatedPost) return res.status(404).json({ message: 'Post no encontrado' });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el post' });
  }
});

export default router;