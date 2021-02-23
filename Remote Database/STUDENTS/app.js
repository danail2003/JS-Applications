const htmlSelectors = {
    body: () => document.querySelector('#results > tbody'),
    loadBtn: () => document.getElementById('load'),
    submitBtn: () => document.querySelector('#create-student > button'),
    error: () => document.getElementById('error'),
    id: () => document.getElementById('id'),
    firstName: () => document.getElementById('firstName'),
    lastName: () => document.getElementById('lastName'),
    facultyNumber: () => document.getElementById('facultyNumber'),
    grade: () => document.getElementById('grade')
};

htmlSelectors.loadBtn().addEventListener('click', loadStudents);
htmlSelectors.submitBtn().addEventListener('click', createStudent);

function createStudent(e) {
    e.preventDefault();

    if (!htmlSelectors.id().value
        || !htmlSelectors.firstName().value
        || !htmlSelectors.lastName().value
        || !htmlSelectors.facultyNumber().value
        || !htmlSelectors.grade().value
        || !Number(htmlSelectors.grade().value)
        || !Number(htmlSelectors.id().value)) {
        return;
    }

    const headers = {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
            id: htmlSelectors.id().value, firstName: htmlSelectors.firstName().value,
            lastName: htmlSelectors.lastName().value, facultyNumber: htmlSelectors.facultyNumber().value,
            grade: htmlSelectors.grade().value
        })
    };

    fetch(`https://students-16ffc.firebaseio.com/Students/.json`, headers)
        .then(loadStudents)
        .catch(errorHandler);

    htmlSelectors.id().value = '';
    htmlSelectors.firstName().value = '';
    htmlSelectors.lastName().value = '';
    htmlSelectors.facultyNumber().value = '';
    htmlSelectors.grade().value = '';
}

function loadStudents() {
    fetch('https://students-16ffc.firebaseio.com/Students/.json')
        .then(res => res.json())
        .then(renderStudents)
        .catch(errorHandler);
}

function renderStudents(students) {
    if (htmlSelectors.body().innerHTML !== '') {
        htmlSelectors.body().innerHTML = '';
    }

    Object.keys(students).forEach(studentId => {
        const { facultyNumber, firstName, grade, id, lastName } = students[studentId];

        const tr = createDOMElement('tr', '', {}, {},
            createDOMElement('td', id, {}, {}),
            createDOMElement('td', firstName, {}, {}),
            createDOMElement('td', lastName, {}, {}),
            createDOMElement('td', facultyNumber, {}, {}),
            createDOMElement('td', grade, {}, {}));

        htmlSelectors.body().appendChild(tr);
    })
}

function errorHandler(e) {
    htmlSelectors.error().style.display = 'block';
    htmlSelectors.error().textContent = e.message;

    setTimeout(() => {
        htmlSelectors.error().style.display = 'none';
    }, 3000)
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