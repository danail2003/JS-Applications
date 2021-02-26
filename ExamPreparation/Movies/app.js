const userModel = firebase.auth();
const db = firebase.firestore();
const errorBox = document.getElementById('errorBox');
const successNotification = document.getElementsByClassName('notifications')[1];
const errorNotification = document.getElementsByClassName('notifications')[0];
const successBox = document.getElementById('successBox');

const app = Sammy('#container', function () {
    this.use('Handlebars', 'hbs');

    this.get('#/home', function (context) {
        db.collection('movies').get()
            .then((res) => {
                context.movies = res.docs.map((x) => { return { id: x.id, ...x.data() } });
                loadPartials(context)
                    .then(function () {
                        this.partial('./templates/home.hbs');
                    })
            })
            .catch(errorHandler);
    });

    this.get('#/register', function (context) {
        loadPartials(context)
            .then(function () {
                this.partial('./templates/register.hbs');
            });
    });

    this.post('#/register', function (context) {
        const { email, password, repeatPassword } = context.params;

        if (!email || password !== repeatPassword || password.length < 6) {
            return;
        }

        userModel.createUserWithEmailAndPassword(email, password)
            .then(() => {
                successOperation('Successful registration!');

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

        userModel.signInWithEmailAndPassword(email, password)
            .then((user) => {
                successOperation('Login successful.');
                saveUser(user);

                this.redirect('#/home');
            })
            .catch(errorHandler);
    });

    this.get('#/logout', function () {
        userModel.signOut()
            .then(() => {
                successOperation('Successful logout');
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
        const { title, description, imageUrl } = context.params;
        const creator = hasUser().uid;

        if (!title || !description || !imageUrl) {
            return;
        }

        db.collection('movies').add({
            title,
            description,
            imageUrl,
            creator,
            likers: []
        })
            .then(() => {
                successOperation('Created successfully!');
                this.redirect('#/home');
            })
            .catch(errorHandler);
    });

    this.get('#/details/:id', function (context) {
        const { id } = context.params;

        db.collection('movies').doc(id).get()
            .then((res) => {
                const data = res.data();
                const { uid } = hasUser();
                const creator = data.creator == uid;
                const index = data.likers.indexOf(uid);
                const isLiker = index > -1;

                context.movie = { ...data, creator, id: id, isLiker };
                loadPartials(context)
                    .then(function () {
                        this.partial('./templates/details.hbs');
                    });
            })
            .catch(errorHandler);
    });

    this.get('#/delete/:id', function (context) {
        const { id } = context.params;

        db.collection('movies').doc(id).delete()
            .then(() => {
                successOperation('Deleted successfully');
                this.redirect('#/home');
            })
            .catch(errorHandler);
    });

    this.get('#/edit/:id', function (context) {
        const { id } = context.params;

        db.collection('movies').doc(id).get()
            .then((res) => {
                context.movie = { id: id, ...res.data() };
                loadPartials(context)
                    .then(function () {
                        this.partial('./templates/edit.hbs')
                    });
            })
            .catch(errorHandler);
    });

    this.post('#/edit/:id', function (context) {
        const { id, title, description, imageUrl } = context.params;

        db.collection('movies').doc(id).get()
            .then((res) => {
                return db.collection('movies').doc(id).set({
                    ...res.data(),
                    title,
                    description,
                    imageUrl
                });
            })
            .then(() => {
                successOperation('Eddited successfully');
                this.redirect(`#/details/${id}`);
            })
            .catch(errorHandler);
    });

    this.get('#/like/:id', function (context) {
        const { id } = context.params;
        const { uid } = hasUser();

        db.collection('movies').doc(id).get()
            .then((res) => {
                const data = { ...res.data() };
                data.likers.push(uid);
                successOperation('Liked successfully');
                return db.collection('movies').doc(id).set(data);
            })
            .catch(errorHandler);
    });
});

function loadPartials(context) {
    const user = hasUser();
    context.isLogged = Boolean(user);
    context.email = user ? user.email : '';

    return context.loadPartials({
        header: './templates/header.hbs',
        footer: './templates/footer.hbs'
    });
}

function successOperation(message) {
    successBox.textContent = message;
    successNotification.style.display = 'block';

    setTimeout(() => {
        successNotification.style.display = 'none';
    }, 3000);
}

function errorHandler(error) {
    errorBox.textContent = error.message;
    errorNotification.style.display = 'block';

    setTimeout(() => {
        errorNotification.style.display = 'none';
    }, 3000);
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