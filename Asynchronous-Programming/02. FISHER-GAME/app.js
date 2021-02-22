function attachEvents() {
    const angler = document.getElementsByTagName('fieldset')[1].children[2];
    const weight = document.getElementsByTagName('fieldset')[1].children[4];
    const species = document.getElementsByTagName('fieldset')[1].children[6];
    const location = document.getElementsByTagName('fieldset')[1].children[8];
    const bait = document.getElementsByTagName('fieldset')[1].children[10];
    const captureTime = document.getElementsByTagName('fieldset')[1].children[12];
    const addBtn = document.getElementsByTagName('fieldset')[1].children[13];
    const loadBtn = document.getElementsByTagName('aside')[0].children[0];
    const updateBtn = document.getElementsByClassName('update')[0];
    const deleteBtn = document.getElementsByClassName('delete')[0];

    addBtn.addEventListener('click', addCatch);
    loadBtn.addEventListener('click', loadCatch);

    function addCatch() {
        const headers = {
            method: 'POST', headers: { 'Content-type': 'application/json' }, body: JSON.stringify({
                'angler': angler.value,
                'weight': weight.value,
                'species': species.value,
                'location': location.value,
                'bait': bait.value,
                'captureTime': captureTime.value
            })
        };

        const addUrl = 'https://fisher-game.firebaseio.com/catches.json';

        fetch(addUrl, headers)
            .then(loadCatch)
            .catch(() => console.log('Error'));
    }

    function loadCatch() {
        clear();

        const loadUrl = 'https://fisher-game.firebaseio.com/catches.json';

        fetch(loadUrl)
            .then(res => res.json())
            .then(data => {
                Object.entries(data).forEach(([id, i]) => {
                    const catchDiv = document.createElement('div');
                    catchDiv.className = 'catch';
                    catchDiv.setAttribute('data-id', id);

                    const anglerLabel = document.createElement('label');
                    anglerLabel.textContent = 'Angler';

                    const anglerInput = document.createElement('input');
                    anglerInput.className = 'angler';
                    anglerInput.type = 'text';
                    anglerInput.value = i.angler;

                    const weightLabel = document.createElement('label');
                    weightLabel.textContent = 'Weight';

                    const weightInput = document.createElement('input');
                    weightInput.className = 'weight';
                    weightInput.type = 'number';
                    weightInput.value = i.weight;

                    const speciesLabel = document.createElement('label');
                    speciesLabel.textContent = 'Species';

                    const speciesInput = document.createElement('input');
                    speciesInput.className = 'species';
                    speciesInput.type = 'text';
                    speciesInput.value = i.species;

                    const locationLabel = document.createElement('label');
                    locationLabel.textContent = 'Location';

                    const locationInput = document.createElement('input');
                    locationInput.className = 'location';
                    locationInput.type = 'text';
                    locationInput.value = i.location;

                    const baitLabel = document.createElement('label');
                    baitLabel.textContent = 'Bait';

                    const baitInput = document.createElement('input');
                    baitInput.className = 'bait';
                    baitInput.type = 'text';
                    baitInput.value = i.bait;

                    const captureTimeLabel = document.createElement('label');
                    captureTimeLabel.textContent = 'Capture Time';

                    const captureTimeInput = document.createElement('input');
                    captureTimeInput.className = 'captureTime';
                    captureTimeInput.type = 'number';
                    captureTimeInput.value = i.captureTime;

                    updateBtn.addEventListener('click', updateCatch);
                    deleteBtn.addEventListener('click', deleteCatch);

                    catchDiv.append(anglerLabel, anglerInput);
                    catchDiv.appendChild(document.createElement('hr'));
                    catchDiv.append(weightLabel, weightInput);
                    catchDiv.appendChild(document.createElement('hr'));
                    catchDiv.append(speciesLabel, speciesInput);
                    catchDiv.appendChild(document.createElement('hr'));
                    catchDiv.append(locationLabel, locationInput);
                    catchDiv.appendChild(document.createElement('hr'));
                    catchDiv.append(baitLabel, baitInput);
                    catchDiv.appendChild(document.createElement('hr'));
                    catchDiv.append(captureTimeLabel, captureTimeInput);
                    catchDiv.appendChild(document.createElement('hr'));
                    catchDiv.append(updateBtn, deleteBtn);
                    document.getElementById('catches').appendChild(catchDiv);
                })
            })
            .catch(() => console.log('Error'));
    }

    function clear() {
        let catches = Array.from(document.getElementById('catches').children);

        if (catches.length > 1) {
            for (let i = 1; i < catches.length; i++) {
                catches[i].remove();
            }
        }
    }

    function updateCatch() {
        const id = this.parentNode.getAttribute('data-id');
        const headers = {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'angler': this.parentNode.querySelector('.angler').value,
                'weight': this.parentNode.querySelector('.weight').value,
                'species': this.parentNode.querySelector('.species').value,
                'location': this.parentNode.querySelector('.location').value,
                'bait': this.parentNode.querySelector('.bait').value,
                'captureTime': this.parentNode.querySelector('.captureTime').value
            })
        };

        const updateUrl = `https://fisher-game.firebaseio.com/catches/${id}.json`;

        fetch(updateUrl, headers)
            .then(() => { loadCatch() })
            .catch(() => console.log('Error'));
    }

    function deleteCatch() {
        const id = this.parentNode.getAttribute('data-id');
        this.parentNode.parentNode.removeChild(this.parentNode);

        const headers = { method: 'DELETE' };
        const deleteUrl = `https://fisher-game.firebaseio.com/catches/${id}.json`


        fetch(deleteUrl, headers)
            .then(() => { loadCatch() })
            .catch((e) => console.log(e.message));
    }
}

attachEvents();