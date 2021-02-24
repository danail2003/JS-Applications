const contacts = [
    {
        id: 1,
        name: "John",
        phoneNumber: "0847759632",
        email: "john@john.com"
    },
    {
        id: 2,
        name: "Merrie",
        phoneNumber: "0845996111",
        email: "merrie@merrie.com"
    },
    {
        id: 3,
        name: "Adam",
        phoneNumber: "0866592475",
        email: "adam@stamat.com"
    },
    {
        id: 4,
        name: "Peter",
        phoneNumber: "0866592475",
        email: "peter@peter.com"
    },
    {
        id: 5,
        name: "Max",
        phoneNumber: "0866592475",
        email: "max@max.com"
    },
    {
        id: 6,
        name: "David",
        phoneNumber: "0866592475",
        email: "david@david.com"
    }
];

const html = {
    contactDiv: (n) => document.getElementById(n),
    contacts: () => document.getElementById('contacts')
};

function attach() {
    fetch('./contact.hbs')
        .then(res => res.text())
        .then(data => {
            const template = Handlebars.compile(data);
            html.contactsDiv().innerHTML = template({ contacts });
        });
}

function showDetails(n) {
    const div = html.contactDiv(n);

    if (div.style.display === 'none') {
        div.style.display = 'block';
    }
    else {
        div.style.display = 'none';
    }
}