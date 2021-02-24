document.getElementById('btnLoadTowns').addEventListener('click', loadTowns);

async function loadTowns() {
    const towns = document.getElementById('towns').value.split(', ');

    await (fetch('./towns.hbs')
        .then(res => res.text())
        .then(data => {
            const template = Handlebars.compile(data);

            document.getElementById('root').innerHTML = template({ towns });
        }))
}