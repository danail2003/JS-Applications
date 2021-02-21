function attachEvents() {
    const sendBtn = document.getElementById('submit');
    const refreshBtn = document.getElementById('refresh');
    const messages = document.getElementById('messages');
    const url = `https://rest-messanger.firebaseio.com/messanger.json`;

    sendBtn.addEventListener('click', send);
    refreshBtn.addEventListener('click', refresh);

    function send() {
        const name = document.getElementById('author').value;
        const message = document.getElementById('content').value;

        const headers = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ author: name, content: message }) };

        fetch(url, headers)
            .then(() => {
                document.getElementById('author').value = '';
                document.getElementById('content').value = '';
            })
            .catch(() => console.log('Error'));
    }

    function refresh() {
        fetch(url)
            .then(r => r.json())
            .then(d => {
                messages.innerHTML = '';
                messages.disabled = false;

                let arr = [];

                for (const obj of Object.entries(d)) {
                    let message = `${obj[1].author}: ${obj[1].content}`;
                    arr.push(message);
                }

                messages.value += arr.join('\n');
            })
            .catch(() => console.log('Error'));
    }
}

const result = attachEvents();