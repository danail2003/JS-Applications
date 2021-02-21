function attachEvents() {
    const loadBtn = document.getElementById('btnLoad');
    const createBtn = document.getElementById('btnCreate');
    const phonebook = document.getElementById('phonebook');
    const getPostUrl = `https://phonebook-nakov.firebaseio.com/phonebook.json`;

    loadBtn.addEventListener('click', load);
    createBtn.addEventListener('click', create);

    function load() {
        fetch(getPostUrl)
            .then(r => r.json())
            .then(d => {
                phonebook.innerHTML = '';

                for (let obj of Object.entries(d)) {
                    const li = document.createElement('li');
                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.id = obj[0];

                    deleteBtn.addEventListener('click', deleteFunc);

                    li.textContent = `${obj[1].person} : ${obj[1].phone}`;
                    li.appendChild(deleteBtn);
                    phonebook.appendChild(li);
                }
            })
            .catch(() => console.log('Error'));
    }

    function deleteFunc() {
        let id = this.id;
        let headers = { method: 'DELETE' };

        fetch(`https://phonebook-nakov.firebaseio.com/phonebook/${id}.json`, headers)
            .then(() => {
                phonebook.innerHTML = '';
                load();
            })
            .catch(() => console.log('Error'));
    }

    function create() {
        const person = document.getElementById('person').value;
        const phone = document.getElementById('phone').value;
        const headers = { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify({ person, phone }) };

        fetch(getPostUrl, headers)
            .then(() => {
                document.getElementById('person').value = '';
                document.getElementById('phone').value = '';
                phonebook.innerHTML = '';
                load();
            })
            .catch(() => console.log('Error'));
    }
}

let result = attachEvents();