const userModel = firebase.auth();
const db = firebase.firestore();

const app = Sammy('#root', function () {
    this.use('Handlebars', 'hbs');

    this.get('#/home', function (context) {
        db.collection('posts').get()
            .then((res) => {
                context.posts = res.docs.map((x) => { return { id: x.id, ...x.data() } });
                loadPartials(context)
                    .then(function () {
                        this.partial('../templates/home.hbs')
                    });
            })
            .catch(errorHandler);
    });

    this.get('#/register', function (context) {
        loadPartials(context)
            .then(function () {
                this.partial('../templates/register.hbs');
            })
            .catch(errorHandler);
    });

    this.post('#/register', function (context) {
        const { email, password, repeatPassword } = context.params;

        if (password !== repeatPassword) {
            return;
        }

        userModel.createUserWithEmailAndPassword(email, password)
            .then((user) => {
                this.redirect('#/home');
            })
            .catch(errorHandler);
    });

    this.get('#/login', function (context) {
        loadPartials(context)
            .then(function () {
                this.partial('../templates/login.hbs');
            })
            .catch(errorHandler);
    });

    this.post('#/login', function (context) {
        const { email, password } = context.params;

        userModel.signInWithEmailAndPassword(email, password)
            .then((user) => {
                saveUser(user);
                this.redirect('#/home');
            })
            .catch(errorHandler);
    });

    this.get('#/logout', function (context) {
        userModel.signOut()
            .then((res) => {
                localStorage.removeItem('user');
                context.isLogged = false;
                this.redirect('#/home');
            })
            .catch(errorHandler);
    });

    this.post('#/create', function (context) {
        const { title, category, content } = context.params;

        db.collection('posts').add({
            title,
            category,
            content
        })
            .then((res) => {
                this.redirect('#/home');
            })
            .catch(errorHandler);
    });

    this.get('#/details/:id', function (context) {
        const { id } = context.params;

        db.collection('posts').doc(id).get()
            .then((res) => {
                const data = res.data();
                context.post = { ...data, id: id };
                loadPartials(context)
                    .then(function () {
                        this.partial('../templates/details.hbs')
                    });
            })
            .catch(errorHandler);
    });

    this.get('#/delete/:id', function (context) {
        const { id } = context.params;

        db.collection('posts').doc(id).delete()
            .then(() => {
                this.redirect('#/home');
            })
            .catch(errorHandler);
    });

    this.get('#/edit/:id', function (context) {
        const { id } = context.params;

        db.collection('posts').doc(id).get()
            .then((res) => {
                context.isEdit = true;
                context.post = { id: id, ...res.data() };
                loadPartials(context)
                    .then(function () {
                        this.partial('../templates/home.hbs');
                    });
            })
            .catch(errorHandler);
    });

    this.post('#/edit/:id', function (context) {
        const { id, title, category, content } = context.params;

        db.collection('posts').doc(id).get()
            .then((res) => {
                return db.collection('posts').doc(id).set({
                    ...res.data(),
                    title,
                    category,
                    content
                });
            })
            .then(() => {
                this.redirect('#/home');
            })
            .catch(errorHandler);
    });
});

function saveUser(userData) {
    const { user: { email, uid } } = userData;
    localStorage.setItem('user', JSON.stringify({ email, uid }));
}

function errorHandler(error) {
    alert(error.message);
}

function loadPartials(context) {
    const user = hasUser();
    context.isLogged = Boolean(user);

    context.email = user ? user.email : '';

    return context.loadPartials({
        header: '../templates/header.hbs'
    });
}

function hasUser() {
    const user = localStorage.getItem('user');

    return user ? JSON.parse(user) : null;
}

(() => {
    app.run('#/home');
})();