const userModel = firebase.auth();
const db = firebase.firestore();

const app = Sammy('#root', function () {
    this.use('Handlebars', 'hbs');

    this.get('#/home', function (context) {
        context.jsArticles = [];
        context.cSharpArticles = [];
        context.javaArticles = [];
        context.phytonArticles = [];

        db.collection('articles').get()
            .then(res => {
                res.forEach(doc => {
                    if (doc.data().category == 'JavaScript') {
                        const article = { ...doc.data(), id: doc.id };
                        context.jsArticles.push(article);
                    }
                    else if (doc.data().category == 'CSharp') {
                        const article = { ...doc.data(), id: doc.id };
                        context.cSharpArticles.push(article);
                    }
                    else if (doc.data().category == 'Java') {
                        const article = { ...doc.data(), id: doc.id };
                        context.javaArticles.push(article);
                    }
                    else if (doc.data().category == 'Phyton') {
                        const article = { ...doc.data(), id: doc.id };
                        context.phytonArticles.push(article);
                    }
                });
                loadPartials(context)
                    .then(function () {
                        this.partial('./templates/home.hbs');
                    });
            })
            .catch(errorHandler);
    });

    this.get('#/register', function (context) {
        loadPartials(context)
            .then(function () {
                this.partial('./templates/register.hbs');
            })
    });

    this.post('#/register', function (context) {
        const { email, password, reppass } = context.params;

        if (password !== reppass) {
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
                this.partial('./templates/login.hbs');
            })
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
        const { title, category, content } = context.params;
        const creator = hasUser().email;

        db.collection('articles').add({
            title,
            category,
            content,
            creator
        })
            .then((res) => {
                this.redirect('#/home');
            })
            .catch(errorHandler);
    });

    this.get('#/details/:id', function (context) {
        const { id } = context.params;

        db.collection('articles').doc(id).get()
            .then((res) => {
                const data = res.data();
                const { email } = hasUser();
                const creator = data.creator === email;
                console.log(creator);

                context.article = { ...data, id: id, creator };
                loadPartials(context)
                    .then(function () {
                        this.partial('./templates/details.hbs');
                    });
            })
            .catch(errorHandler);
    });

    this.get('#/delete/:id', function (context) {
        const { id } = context.params;

        db.collection('articles').doc(id).delete()
            .then(() => {
                this.redirect('#/home');
            })
            .catch(errorHandler);
    });

    this.get('#/edit/:id', function (context) {
        const { id } = context.params;

        db.collection('articles').doc(id).get()
            .then((res) => {
                context.article = { ...res.data(), id: id };
                loadPartials(context)
                    .then(function () {
                        this.partial('./templates/edit.hbs');
                    });
            })
            .catch(errorHandler);
    });

    this.post('#/edit/:id', function (context) {
        const { id, title, category, content } = context.params;

        db.collection('articles').doc(id).get()
            .then((res) => {
                return db.collection('articles').doc(id).set({
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

function errorHandler(error) {
    alert(error.message);
}

function loadPartials(context) {
    const user = hasUser();
    context.isLogged = Boolean(user);
    context.email = user ? user.email : '';

    return context.loadPartials({
        header: './templates/header.hbs',
        footer: './templates/footer.hbs'
    });
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