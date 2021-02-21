function loadRepos() {
	const username = document.getElementById('username').value;
	const repositories = document.getElementById('repos');
	repositories.innerHTML = '';
	const url = `https://api.github.com/users/${username}/repos`;

	fetch(url)
		.then(r => r.json())
		.then((data) => {
			data.forEach(i => {
				const li = document.createElement('li');
				const a = document.createElement('a');
				a.href = i.html_url;
				a.textContent = i.full_name;

				li.appendChild(a);
				repositories.appendChild(li);
			})
		})
		.catch();
}