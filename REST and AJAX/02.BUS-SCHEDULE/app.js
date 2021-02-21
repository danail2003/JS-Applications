function solve() {
    const info = document.getElementsByClassName('info')[0];
    const arriveBtn = document.getElementById('arrive');
    const departBtn = document.getElementById('depart');
    const currentId = 'depot';
    const url = `https://judgetests.firebaseio.com/schedule/${currentId}.json`

    function depart() {
        fetch(url)
            .then(r => r.json())
            .then(d => {
                info.textContent = `Next stop ${d.name}`;
            })
            .catch(() => {
                info.textContent = 'Error';
                departBtn.disabled = true;
                arriveBtn.disabled = true;
            })

        departBtn.disabled = true;
        arriveBtn.disabled = false;
    }

    function arrive() {
        fetch(url)
            .then(r => r.json())
            .then(d => {
                info.textContent = `Arriving at ${d.name}`
            })
            .catch(() => {
                info.textContent = 'Error';
                departBtn.disabled = true;
                arriveBtn.disabled = true;
            })

        departBtn.disabled = false;
        arriveBtn.disabled = true;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();