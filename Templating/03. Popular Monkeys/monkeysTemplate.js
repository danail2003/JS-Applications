const html = {
    section: () => document.getElementsByClassName('monkeys')[0]
};

fetch('./monkey.hbs')
    .then(res => res.text())
    .then((m) => {
        let template = Handlebars.compile(m);
        let result = template({ monkeys });

        html.section().innerHTML = result;

        html.section().addEventListener('click', function (e) {
            e.preventDefault();

            if (e.target.nodeName === 'BUTTON') {
                let div = e.target.parentNode.querySelector('div > p');

                if (div.style.display === 'none') {
                    div.style.display = 'block';
                }
                else {
                    div.style.display = 'none';
                }
            }
        });
    })