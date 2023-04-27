const loadCommentsBtnElement = document.getElementById( "load-comments-btn" );
const commentsSecElement = document.getElementById( "comments" );
const commentsFormElement = document.querySelector( "#comments-form form" );
const commentTitleElement = document.getElementById( "title" );
const commentTextElement = document.getElementById( "text" );

function createCommentList ( comments )
{
    const commentListElement = document.createElement( "ol" );
    for ( const comment of comments )
    {
        const commentElement = document.createElement( "li" );
        commentElement.innerHTML = `
        <article class="comment-item">
            <h2>${ comment.title }</h2>
            <p>${ comment.text }</p>
        </article>
        `;
        commentListElement.appendChild( commentElement );
    }
    return commentListElement;
}

async function fetchComments ()
{
    const postId = loadCommentsBtnElement.dataset.postid;
    try
    {
        const response = await fetch( `/posts/${ postId }/comments` );
        if ( !response )
        {
            alert( "Fetching comments failed!" );
            return;
        }
        const responseData = await response.json();
        //console.log(responseData);
        if ( response && responseData.length > 0 )
        {
            const commentListElement = createCommentList( responseData );
            commentsSecElement.innerHTML = "";
            commentsSecElement.appendChild( commentListElement );
        } else
        {
            commentsSecElement.firstElementChild.textContent =
                "We could not find comments. May be add one?";
        }
    } catch ( error )
    {
        alert( "Getting comments failed." );
    }
}

async function saveComment ( event )
{
    event.preventDefault();
    const postId = commentsFormElement.dataset.postid;
    const enteredTitle = commentTitleElement.value;
    const enteredText = commentTextElement.value;
    const comment = { title: enteredTitle, text: enteredText };
    try
    {
        const response = await fetch( `/posts/${ postId }/comments`, {
            method: "POST",
            body: JSON.stringify( comment ),
            headers: {
                "Content-Type": "application/json"
            }
        } );
        if ( response.ok )
        {
            fetchComments();
        } else
        {
            alert( "sorry! could not send comment." );
        }
    } catch ( error )
    {
        alert( "could not send request - try again later!" );
    }
}

loadCommentsBtnElement.addEventListener( "click", fetchComments );
commentsFormElement.addEventListener( "submit", saveComment );