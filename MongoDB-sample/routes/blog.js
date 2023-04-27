const express = require( 'express' );

const mongodb = require( "mongodb" );

const db = require( '../data/database' );

const router = express.Router();
const ObjectId = mongodb.ObjectId;

router.get( '/', function ( req, res )
{
  res.redirect( '/posts' );
} );

router.get( '/posts', async function ( req, res )
{
  const result = await db.getDb().collection( "posts" ).find( {} ).project( { title: 1, summary: 1, "author.name": 1 } ).toArray();
  //console.log(result);
  res.render( 'posts-list', { posts: result } );
} );

router.get( '/new-post', async function ( req, res )
{
  const result = await db.getDb().collection( "authors" ).find().toArray();
  res.render( 'create-post', { authors: result } );
} );

router.post( '/posts', async function ( req, res )
{
  const authorId = new ObjectId( req.body.author );
  const result1 = await db.getDb().collection( "authors" ).findOne( { _id: authorId } );

  const newPost = {
    title: req.body.title,
    summary: req.body.summary,
    body: req.body.content,
    date: new Date(),
    author: {
      id: authorId,
      name: result1.name,
      email: result1.email
    }
  };

  const result2 = await db.getDb().collection( "posts" ).insertOne( newPost );
  console.log( result2 );

  res.redirect( '/posts' );
} );

router.get( "/posts/:postid", async function ( req, res, next )
{
  let postId = req.params.postid;
  try
  {
    postId = new ObjectId( postId );
  } catch ( error )
  {
    return res.status( 404 ).render( "404" );
    //return next(error);
  }
  const result = await db.getDb().collection( "posts" ).findOne( { _id: postId }, { projection: { summary: 0 } } );
  //console.log(result);
  if ( !result )
  {
    return res.status( 404 ).render( "404" );
  }

  result.humanReadableDate = result.date.toLocaleDateString( "en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  } );

  result.date = result.date.toISOString();

  res.render( "post-detail", { post: result } );
} );

router.get( "/posts/:postid/edit", async function ( req, res )
{
  const postId = req.params.postid;
  const result = await db.getDb().collection( "posts" ).findOne( { _id: new ObjectId( postId ) }, { projection: { title: 1, summary: 1, body: 1, "author.name": 1 } } );
  //console.log(result);
  if ( !result )
  {
    return res.status( 404 ).render( "404" );
  }

  res.render( "update-post", { post: result } );
} );

router.post( "/posts/:postid/edit", async function ( req, res )
{
  const postId = new ObjectId( req.params.postid );
  await db.getDb().collection( "posts" ).updateOne( { _id: postId }, { $set: { title: req.body.title, summary: req.body.summary, body: req.body.content/*,date: new Date()*/ } } );
  res.redirect( "/posts" );
} );

router.post( "/posts/:postid/delete", async function ( req, res )
{
  const postId = new ObjectId( req.params.postid );
  await db.getDb().collection( "posts" ).deleteOne( { _id: postId } );
  res.redirect( "/posts" );
} );

module.exports = router;