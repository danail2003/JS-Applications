function attachEvents() {
    const url = 'https://blog-apps-c12bf.firebaseio.com/posts';
    const loadBtn = document.getElementById('btnLoadPosts');
    const posts = document.getElementById('posts');
    const viewBtn = document.getElementById('btnViewPost');
    const h1 = document.getElementById('post-title');
    const postBody = document.getElementById('post-body');
    const postComments = document.getElementById('post-comments');

    loadBtn.addEventListener('click', loadPosts);
    viewBtn.addEventListener('click', viewPosts);

    function loadPosts() {
        posts.innerHTML = '';

        fetch(`${url}.json`)
            .then(res => {
                if (!res.ok) {
                    throw { status: res.status, statusText: res.statusText };
                }

                return res.json();
            })
            .then(data => {
                Object.entries(data).forEach(([value, element]) => {
                    const option = document.createElement('option');
                    option.value = value;
                    option.id = element.id;
                    option.innerHTML = element.title;
                    posts.appendChild(option);
                })
            })
            .catch(e => console.log(`Error: ${e.status} (${e.statusText})`));
    }

    function viewPosts() {
        postComments.innerHTML = '';
        let postId = posts.value;
        fetch(`${url}/${postId}.json`)
            .then(res => {
                if (!res.ok) {
                    throw { status: res.status, statusText: res.statusText };
                }

                return res.json();
            })
            .then(data => {
                h1.textContent = data.title;
                postBody.textContent = data.body;

                for (let comment of data.comments) {
                    const li = document.createElement('li');
                    li.textContent = comment.text;
                    li.id = comment.id;
                    postComments.appendChild(li);
                }
            })
            .catch(e => console.log(`Error: ${e.status} (${e.statusText})`));
    }
}

attachEvents();