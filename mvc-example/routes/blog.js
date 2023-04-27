const express = require('express');

const blogController = require('../controllers/blog-controller');

const protect = require('../middlewares/auth-protection-middleware');

const router = express.Router();

router.get('/', blogController.getHome);

router.use(protect);

router.get('/admin', blogController.getAdmin);

router.post('/posts', blogController.createPost);

router.get('/posts/:id/edit', blogController.getSinglePost);

router.post('/posts/:id/edit', blogController.editPost);

router.post('/posts/:id/delete', blogController.deletePost);

module.exports = router;
