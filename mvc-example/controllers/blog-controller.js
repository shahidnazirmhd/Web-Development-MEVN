const Post = require('../models/post');
const validationSession = require('../util/validation-session');
const inputValidation = require('../util/validation');

function getHome (req, res) {
    res.render('welcome');
  }

async function getAdmin (req, res) {
    const posts =  await Post.fetchAll();
  
    const sessionErrorData = validationSession.getSessionErrorData(req, {
      title: '',
      content: ''
    });
  
    res.render('admin', {
      posts: posts,
      inputData: sessionErrorData,
    });
  }

  async function createPost (req, res) {
    const enteredTitle = req.body.title;
    const enteredContent = req.body.content;
  
    if (
      !inputValidation.postIsValid(enteredTitle, enteredContent)
    ) {
      validationSession.flashErrorsToSession(req, {
        message: 'Invalid input - please check your data.',
        title: enteredTitle,
        content: enteredContent,
      }, function () {
        res.redirect('/admin');
      });

      return; // or return res.redirect('/admin'); => Has the same effect
    }
  
    const post = new Post(enteredTitle, enteredContent);
    await post.save();
  
    res.redirect('/admin');
  }  

async function getSinglePost (req, res, next) {
    const postId = req.params.id;
    let post;
    try {
      post = new Post(null, null, postId);
    } catch (error) {
      //next(error);
      res.render('404');
      return;
    }
    await post.fetch();
  
    if (!post.title || !post.content) {
      return res.render('404'); // 404.ejs is missing at this point - it will be added later!
    }
  
    const sessionErrorData = validationSession.getSessionErrorData(req, {
      title: post.title,
      content: post.content
    });
  
    res.render('single-post', {
      post: post,
      inputData: sessionErrorData
    });
  }

  async function editPost (req, res) {
    const enteredTitle = req.body.title;
    const enteredContent = req.body.content;
    const postId = req.params.id;
  
    if (
      !inputValidation.postIsValid(enteredTitle, enteredContent)
    ) {
      validationSession.flashErrorsToSession(req, {
        message: 'Invalid input - please check your data.',
        title: enteredTitle,
        content: enteredContent
      }, function () {
        res.redirect(`/posts/${req.params.id}/edit`);
      });
  
      return; 
    }
  
    const post = new Post(enteredTitle, enteredContent, postId);
    await post.save();
  
    res.redirect('/admin');
  }  

  async function deletePost (req, res) {
    const postId = req.params.id;
    
    const post = new Post(null, null, postId);
    await post.delete();
  
    res.redirect('/admin');
  }  

  module.exports = {
    getHome: getHome,
    getAdmin: getAdmin,
    createPost: createPost,
    getSinglePost: getSinglePost,
    editPost: editPost,
    deletePost: deletePost
  };