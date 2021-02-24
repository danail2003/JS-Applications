const html = {
    allCats: () => document.getElementById('allCats')
}

Promise.all([
    fetch('./template.hbs').then(res => res.text()),
    fetch('./cat.hbs').then(res => res.text())
])
    .then(([src, cat]) => {
        Handlebars.registerPartial('cat', cat);
        let template = Handlebars.compile(src);
        let result = template({ cats });
        html.allCats().innerHTML = result;

        html.allCats().addEventListener('click', function (e) {
            e.preventDefault();

            if (e.target.nodeName === 'BUTTON') {
                let div = e.target.parentNode.querySelector('div.status');

                if (div.style.display === 'none') {
                    div.style.display = 'block';
                    e.target.textContent = 'Hide status code';
                }
                else {
                    div.style.display = 'none';
                    e.target.textContent = 'Show status code';
                }
            }
        });
    })
    .catch((e) => console.error(e));

document.getElementById('')
