function loadCommits() {
    const commits = document.getElementById('commits');
    const username = document.getElementById('username').value;
    const repos = document.getElementById('repo').value;
    const url = `https://api.github.com/repos/${username}/${repos}/commits`;

    commits.innerHTML = '';

    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw { status: res.status, statusText: res.statusText };
            }

            return res.json();
        })
        .then(data => {
            Object.entries(data).forEach(i => {
                const li = document.createElement('li');
                li.textContent = `${i[1].commit.author.name}: ${i[1].commit.message}`;
                commits.appendChild(li);
            })
        })
        .catch((res) => {
            const li = document.createElement('li');
            li.textContent = `Error: ${res.status} (${res.statusText})`;
            commits.appendChild(li);
        })
}