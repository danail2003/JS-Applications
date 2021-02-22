function attachEvents() {
    const locationsUrl = 'https://judgetests.firebaseio.com/locations.json';
    const submitBtn = document.getElementById('submit');
    const forecastDiv = document.getElementById('forecast');
    const currentForecast = document.getElementById('current');
    const upcomingForecast = document.getElementById('upcoming');
    let array = [];
    let code = '';

    fetch(locationsUrl)
        .then(res => res.json())
        .then(data => {
            Object.entries(data).forEach(i => {
                array.push(i);
            })
        })
        .catch(() => {
            const div = document.createElement('div');
            div.textContent = 'Error';

            forecastDiv.appendChild(div);
        })

    submitBtn.addEventListener('click', forecast);

    function forecast() {
        const location = document.getElementById('location').value;

        for (let [_, cod] of array) {
            if (location === cod.name) {
                code = cod.code;
            }
        }

        document.getElementById('forecast').style.display = 'block';

        if (code === '') {
            const div = document.createElement('div');
            div.textContent = 'Error';

            forecastDiv.appendChild(div);
            return;
        }


        const oneDayUrl = `https://judgetests.firebaseio.com/forecast/today/${code}.json`;

        fetch(oneDayUrl)
            .then(res => res.json())
            .then(data => {
                if (currentForecast.children.length > 1) {
                    currentForecast.removeChild(currentForecast.children[1]);
                }

                const div = document.createElement('div');
                div.classList.add('forecasts');

                const symbolSpan = document.createElement('span');
                symbolSpan.classList.add('condition');
                symbolSpan.classList.add('symbol');

                if (data.forecast.condition === 'Sunny') {
                    symbolSpan.innerHTML = '&#x2600;';
                }
                else if (data.forecast.condition === 'Partly sunny') {
                    symbolSpan.innerHTML = '&#x26C5;';
                }
                else if (data.forecast.condition === 'Overcast') {
                    symbolSpan.innerHTML = '&#x2601;';
                }
                else if (data.forecast.condition === 'Rain') {
                    symbolSpan.innerHTML = '&#x2614;';
                }

                div.appendChild(symbolSpan);

                const conditionSpan = document.createElement('span');
                conditionSpan.classList.add('condition');

                const countrySpan = document.createElement('span');
                countrySpan.classList.add('forecast-data');
                countrySpan.textContent = data.name;

                const gradusSpan = document.createElement('span');
                gradusSpan.classList.add('forecast-data');
                gradusSpan.innerHTML = `${data.forecast.low}&#176;/${data.forecast.high}&#176;`;

                const forecastSpan = document.createElement('span');
                forecastSpan.classList.add('forecast-data');
                forecastSpan.textContent = data.forecast.condition;

                conditionSpan.appendChild(countrySpan);
                conditionSpan.appendChild(gradusSpan);
                conditionSpan.appendChild(forecastSpan);
                div.appendChild(conditionSpan);
                currentForecast.appendChild(div);
            })
            .catch(() => {
                const div = document.createElement('div');
                div.textContent = 'Error';

                forecastDiv.appendChild(div);
            })

        const threeDaysForecast = `https://judgetests.firebaseio.com/forecast/upcoming/${code}.json`;

        fetch(threeDaysForecast)
            .then(res => res.json())
            .then(data => {
                if (upcomingForecast.children[1]) {
                    upcomingForecast.children[1].remove();
                }

                const div = document.createElement('div');
                div.classList.add('forecast-info');

                for(let fore of data.forecast){
                    const span = document.createElement('span');
                    span.classList.add('upcoming');

                    const symbolSpan = document.createElement('span');
                    symbolSpan.classList.add('symbol');

                    const degreesSpan = document.createElement('span');
                    degreesSpan.classList.add('forecast-data');

                    const conditionSpan = document.createElement('span');
                    conditionSpan.classList.add('forecast-data');

                    if (fore.condition === 'Sunny') {
                        symbolSpan.innerHTML = '&#x2600;';
                    }
                    else if (fore.condition === 'Partly sunny') {
                        symbolSpan.innerHTML = '&#x26C5;';
                    }
                    else if (fore.condition === 'Overcast') {
                        symbolSpan.innerHTML = '&#x2601;';
                    }
                    else if (fore.condition === 'Rain') {
                        symbolSpan.innerHTML = '&#x2614;';
                    }

                    degreesSpan.innerHTML = `${fore.low}&#176;/${fore.high}&#176;`;
                    conditionSpan.textContent = fore.condition;

                    span.appendChild(symbolSpan);
                    span.appendChild(degreesSpan);
                    span.appendChild(conditionSpan);
                    div.appendChild(span);
                    upcomingForecast.appendChild(div);
                }
            })
            .catch(() => {
                const div = document.createElement('div');
                div.textContent = 'Error';

                forecastDiv.appendChild(div);
            })
    }
}

attachEvents();