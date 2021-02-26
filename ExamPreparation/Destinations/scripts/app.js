const userModel = firebase.auth();
const db = firebase.firestore();
const errorBox = document.getElementById('errorBox');
const infoBox = document.getElementById('infoBox');
const loadingBox = document.getElementById('loadingBox');

const app = Sammy('#container', function () {
    this.use('Handlebars', 'hbs');

    this.get('#/home', function (context) {
        db.collection('destinations').get()
            .then((res) => {
                context.destinations = res.docs.map((x) => { return { id: x.id, ...x.data() } });
                loadPartials(context)
                    .then(function () {
                        this.partial('./templates/home.hbs');
                    });
            });
    });

    this.get('#/register', function (context) {
        loadPartials(context)
            .then(function () {
                this.partial('./templates/register.hbs');
            });
    });

    this.post('#/register', function (context) {
        const { email, password, rePassword } = context.params;

        if (!email || !password || !rePassword || password !== rePassword) {
            errorHandler('Invalid email or password.');
            return;
        }

        loadingBox.style.display = 'block';

        userModel.createUserWithEmailAndPassword(email, password)
            .then((user) => {
                loadingBox.style.display = 'none';
                saveUser(user);
                successOperation('User registration successful.');
                this.redirect('#/home');
            })
            .catch(errorHandler);
    });

    this.get('#/login', function (context) {
        loadPartials(context)
            .then(function () {
                this.partial('./templates/login.hbs');
            });
    });

    this.post('#/login', function (context) {
        const { email, password } = context.params;

        if (!email || !password) {
            errorHandler('Invalid email or password.');
            return;
        }

        loadingBox.style.display = 'block';

        userModel.signInWithEmailAndPassword(email, password)
            .then((user) => {
                loadingBox.style.display = 'none';
                successOperation('Login successful');
                saveUser(user);
                this.redirect('#/home');
            })
            .catch(errorHandler);
    });

    this.get('#/logout', function () {
        loadingBox.style.display = 'block';
        userModel.signOut()
            .then(() => {
                loadingBox.style.display = 'none';
                successOperation('Logout successful.');
                localStorage.removeItem('user');
                this.redirect('#/login');
            })
            .catch(errorHandler);
    });

    this.get('#/create', function (context) {
        loadPartials(context)
            .then(function () {
                this.partial('./templates/create.hbs');
            });
    });

    this.post('#/create', function (context) {
        const { destination, city, duration, departureDate, imgUrl } = context.params;
        const creator = hasUser().uid;

        if (!destination || !city || !duration || !departureDate || !imgUrl || duration < 1 || duration > 100) {
            errorHandler('All fields shouldn\'t be empty!');
            return;
        }

        loadingBox.style.display = 'block';

        db.collection('destinations').add({
            destination,
            city,
            duration,
            departureDate,
            imgUrl,
            creator
        })
            .then(() => {
                loadingBox.style.display = 'none';
                successOperation('Successfully created destination.');
                this.redirect('#/home');
            })
            .catch(errorHandler);
    });

    this.get('#/details/:id', function (context) {
        const { id } = context.params;

        db.collection('destinations').doc(id).get()
            .then((res) => {
                const { uid } = hasUser();
                const data = res.data();
                const creator = data.creator == uid;

                context.destination = { id: id, ...res.data(), creator };
                loadPartials(context)
                    .then(function () {
                        this.partial('./templates/details.hbs');
                    });
            });
    });

    this.get('#/delete/:id', function (context) {
        const { id } = context.params;
        loadingBox.style.display = 'block';

        db.collection('destinations').doc(id).delete()
            .then(() => {
                loadingBox.style.display = 'none';
                successOperation('Destination deleted.');
                this.redirect('#/dashboard');
            })
            .catch(errorHandler);
    });

    this.get('#/edit/:id', function (context) {
        const { id } = context.params;

        db.collection('destinations').doc(id).get()
            .then((res) => {
                context.destination = { id: id, ...res.data() };
                loadPartials(context)
                    .then(function () {
                        this.partial('./templates/edit.hbs');
                    });
            });
    });

    this.post('#/edit/:id', function (context) {
        const { id, destination, city, duration, departureDate, imgUrl } = context.params;

        if (!destination || !city || !duration || !departureDate || !imgUrl || duration < 1 || duration > 100) {
            errorHandler('All fields shouldn\'t be empty!');
            return;
        }

        loadingBox.style.display = 'block';

        db.collection('destinations').doc(id).get()
            .then((res) => {
                return db.collection('destinations').doc(id).set({
                    ...res.data(),
                    destination,
                    city,
                    duration,
                    departureDate,
                    imgUrl
                });
            })
            .then(() => {
                loadingBox.style.display = 'none';
                successOperation('Successfully edited destination.');
                this.redirect(`#/details/${id}`);
            })
            .catch(errorHandler);
    });

    this.get('#/dashboard', function (context) {
        db.collection('destinations').get()
            .then((res) => {
                context.destinations = res.docs.map((x) => { return { id: x.id, ...x.data() } });
                loadPartials(context)
                    .then(function () {
                        this.partial('./templates/dashboard.hbs');
                    });
            });
    });
});

function loadPartials(context) {
    const user = hasUser();
    const email = user ? user.email : '';

    context.isLogged = Boolean(user);
    context.email = email;

    return context.loadPartials({
        header: './templates/header.hbs',
        footer: './templates/footer.hbs'
    });
}

function errorHandler(error) {
    loadingBox.style.display = 'none';
    errorBox.textContent = error;
    errorBox.style.display = 'block';

    setTimeout(() => {
        errorBox.style.display = 'none';
    }, 3000);
}

function successOperation(message) {
    infoBox.textContent = message;
    infoBox.style.display = 'block';

    setTimeout(() => {
        infoBox.style.display = 'none';
    }, 3000)
}

function saveUser(userData) {
    const { user: { email, uid } } = userData;

    localStorage.setItem('user', JSON.stringify({ email, uid }));
}

function hasUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

(() => {
    app.run('#/home');
})();