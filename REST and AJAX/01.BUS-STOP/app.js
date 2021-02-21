function getInfo() {
    const stop = document.getElementById('stopId');
    const stopName = document.getElementById('stopName');
    const buses = document.getElementById('buses');
    const url = `https://judgetests.firebaseio.com/businfo/${stop.value}.json`;

    stopName.textContent = '';
    buses.innerHTML = '';

    fetch(url)
        .then(res => res.json())
        .then(data => {
            stopName.textContent = data.name;

            Object.entries(data.buses).forEach(([bus, time]) => {
                const li = document.createElement('li');
                li.textContent = `Bus ${bus} arrives in ${time} minutes`;
                buses.appendChild(li);
            })
        })
        .catch(() => stopName.textContent = 'Error');
}