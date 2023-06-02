const posts = [
    { title: 'Post One', body: 'This is post one' },
    { title: 'Post Two', body: 'This is post two' }
]

function getPosts() {
    setTimeout(() =>{
        let output = '';
        posts.forEach(post => output += `<h1>${post.title}</h1>`);  
        document.body.innerHTML = output;
    }, 1000)
}

function createPost(post) {
    return new Promise((resolve, reject) => { 
        setTimeout(() => {
            posts.push(post)
            const error = false;

            if(!error) {
                resolve();
            } else {
                reject('Error Something is wrong');
            }
        }, 2000)
    });
}


// Create post returns a promise, after createPost is done then we run getPostst
createPost({ title: 'Post Two', body: 'This is post two' })
.then(getPosts);
