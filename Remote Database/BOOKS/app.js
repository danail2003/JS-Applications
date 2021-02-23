const htmlSelectors = {
    loadBtn: () => document.getElementById('loadBooks'),
    body: () => document.getElementsByTagName('tbody')[0],
    submitBtn: () => document.querySelector('form > button'),
    error: () => document.getElementById('error-notification'),
    title: () => document.getElementById('title'),
    author: () => document.getElementById('author'),
    isbn: () => document.getElementById('isbn'),
    editTitle: () => document.getElementById('edit-title'),
    editAuthor: () => document.getElementById('edit-author'),
    editIsbn: () => document.getElementById('edit-isbn'),
    editBtn: () => document.querySelector('#edit-form > button'),
    editForm: () => document.getElementById('edit-form')
}

htmlSelectors.loadBtn().addEventListener('click', loadBooks);
htmlSelectors.submitBtn().addEventListener('click', createBook);
htmlSelectors.editBtn().addEventListener('click', editBook);

function loadBooks() {
    fetch('https://books-b4d9e.firebaseio.com/Books/.json')
        .then(res => res.json())
        .then(renderBooks)
        .catch(errorHandler);
}

function createBook(e) {
    e.preventDefault();

    if (!htmlSelectors.title().value || !htmlSelectors.author().value || !htmlSelectors.isbn().value) {
        return;
    }

    const url = 'https://books-b4d9e.firebaseio.com/Books/.json';

    const headers = {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
            title: htmlSelectors.title().value,
            author: htmlSelectors.author().value,
            isbn: htmlSelectors.isbn().value
        })
    };

    fetch(url, headers)
        .then(loadBooks)
        .catch(errorHandler);

    htmlSelectors.title().value = '';
    htmlSelectors.author().value = '';
    htmlSelectors.isbn().value = '';
}

function renderBooks(books) {
    if (htmlSelectors.body().innerHTML !== '') {
        htmlSelectors.body().innerHTML = '';
    }

    Object.keys(books).forEach(bookId => {
        const { title, author, isbn } = books[bookId];

        const tr = createDOMElement('tr', '', {}, {},
            createDOMElement('td', title, {}, {}),
            createDOMElement('td', author, {}, {}),
            createDOMElement('td', isbn, {}, {}),
            createDOMElement('td', '', {}, {},
                createDOMElement('button', 'Edit', { 'data-key': bookId }, { click: loadBookById }),
                createDOMElement('button', 'Delete', { 'data-key': bookId }, { click: deleteBook })));

        htmlSelectors.body().appendChild(tr);
    })
}

function loadBookById() {
    const id = this.getAttribute('data-key');

    fetch(`https://books-b4d9e.firebaseio.com/Books/${id}.json`)
        .then(res => res.json())
        .then(({ title, author, isbn }) => {
            htmlSelectors.editTitle().value = title;
            htmlSelectors.editAuthor().value = author;
            htmlSelectors.editIsbn().value = isbn;
            htmlSelectors.editForm().style.display = 'block';
            htmlSelectors.editBtn().setAttribute('data-key', id);
        })
        .catch(errorHandler)
}

function editBook(e) {
    e.preventDefault();

    const id = this.getAttribute('data-key');

    const headers = {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
            title: htmlSelectors.editTitle().value,
            author: htmlSelectors.editAuthor().value,
            isbn: htmlSelectors.editIsbn().value
        })
    };

    if (!htmlSelectors.editTitle().value || !htmlSelectors.editAuthor().value || !htmlSelectors.editIsbn().value) {
        return;
    }

    htmlSelectors.editForm().style.display = 'none';

    fetch(`https://books-b4d9e.firebaseio.com/Books/${id}.json`, headers)
        .then(loadBooks)
        .catch(errorHandler);
}

function deleteBook() {
    const id = this.getAttribute('data-key');

    const method = { method: 'DELETE' };

    fetch(`https://books-b4d9e.firebaseio.com/Books/${id}.json`, method)
        .then(loadBooks)
        .catch(errorHandler);
}

function errorHandler(e) {
    htmlSelectors.error().style.display = 'block';
    htmlSelectors.error().textContent = e.message;

    setTimeout(() => {
        htmlSelectors.error().style.display = 'none';
    }, 3000);
}

function createDOMElement(type, text, attributes, events, ...children) {
    const element = document.createElement(type);

    if (text) {
        element.textContent = text;
    }

    Object.entries(attributes).forEach(([attrKey, attrValue]) => {
        element.setAttribute(attrKey, attrValue);
    });

    Object.entries(events).forEach(([eventName, eventHandler]) => {
        element.addEventListener(eventName, eventHandler);
    });

    element.append(...children);

    return element;
}