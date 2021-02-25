const userModel = firebase.auth();
const db = firebase.firestore();
const info = document.getElementById('infoBox');
const errorBox = document.getElementById('errorBox');
let counter = 0;

const app = Sammy('#main', function () {
    this.use('Handlebars', 'hbs');

    this.get('#/home', function (context) {
        const user = hasUser();


        if (user) {
            context.loggedIn = true;
            context.email = user.email;
        }

        if (counter > 0) {
            context.hasTeam = true;
        }

        this.loadPartials({
            header: '../templates/common/header.hbs',
            footer: '../templates/common/footer.hbs'
        })
            .then(function () {
                this.partial('../templates/home/home.hbs');
            });
    });

    this.get('#/about', function (context) {
        const user = hasUser();

        if (user) {
            context.loggedIn = true;
            context.email = user.email;
        }

        this.loadPartials({
            header: '../templates/common/header.hbs',
            footer: '../templates/common/footer.hbs'
        })
            .then(function () {
                this.partial('../templates/about/about.hbs');
            });
    });

    this.get('#/register', function () {
        this.loadPartials({
            header: '../templates/common/header.hbs',
            footer: '../templates/common/footer.hbs',
            registerForm: '../templates/register/registerForm.hbs'
        })
            .then(function () {
                this.partial('../templates/register/registerPage.hbs');
            });
    });

    this.post('#/register', function (context) {
        const { email, password, repeatPassword } = context.params;

        if (password !== repeatPassword) {
            errorBox.textContent = 'Passwords must be same';
            errorBox.style.display = 'block';

            setTimeout(() => {
                errorBox.style.display = 'none';
            }, 3000)

            return;
        }

        userModel.createUserWithEmailAndPassword(email, password)
            .then((user) => {
                successfullNotification();
                this.redirect('#/login');
            })
            .catch(errorHandler);
    });

    this.get('#/login', function () {
        this.loadPartials({
            header: '../templates/common/header.hbs',
            footer: '../templates/common/footer.hbs',
            loginForm: '../templates/login/loginForm.hbs'
        })
            .then(function () {
                this.partial('../templates/login/loginPage.hbs');
            });
    });

    this.post('#/login', function (context) {
        const { email, password } = context.params;

        userModel.signInWithEmailAndPassword(email, password)
            .then((user) => {
                saveUser(user);
                successfullNotification();
                this.redirect('#/home');
            })
            .catch(errorHandler);
    });

    this.get('#/logout', function (context) {
        userModel.signOut()
            .then((user) => {
                localStorage.removeItem('user');
                context.loggedIn = false;
                successfullNotification();
                this.redirect('#/home');
            })
            .catch(errorHandler);
    });

    this.get('#/catalog', function (context) {
        const user = hasUser();


        if (user) {
            context.loggedIn = true;
            context.email = user.email;
        }

        if (counter > 0) {
            context.hasNoTeam = false;
        }

        db.collection('teams').get()
            .then((res) => {
                context.teams = res.docs.map((x) => { return { id: x.id, ...x.data() } });
                this.loadPartials({
                    header: '../templates/common/header.hbs',
                    footer: '../templates/common/footer.hbs',
                    team: '../templates/catalog/team.hbs'
                })
                    .then(function () {
                        this.partial('../templates/catalog/teamCatalog.hbs');
                    });
            })
            .catch(errorHandler);
    });

    this.get('#/create', function () {
        this.loadPartials({
            header: '../templates/common/header.hbs',
            footer: '../templates/common/footer.hbs',
            createForm: '../templates/create/createForm.hbs'
        })
            .then(function () {
                this.partial('../templates/create/createPage.hbs');
            });
    });

    this.post('#/create', function (context) {
        const { name, comment } = context.params;
        const { uid } = JSON.parse(localStorage.getItem('user'));

        db.collection('teams').add({
            name,
            comment,
            creator: uid,
            members: []
        })
            .then(() => {
                counter++;
                successfullNotification();
                this.redirect('#/home');
            })
            .catch(errorHandler);
    });

    this.get('#/edit', function () {
        this.loadPartials({
            header: '../templates/common/header.hbs',
            footer: '../templates/common/footer.hbs',
            editForm: '../templates/edit/editForm.hbs'
        })
            .then(function () {
                this.partial('../templates/edit/editPage.hbs');
            });
    });

    this.get('#/details/:id', function (context) {
        const user = localStorage.getItem('user');

        if (user) {
            context.loggedIn = true;
        }

        const { id } = context.params;

        db.collection('teams').doc(id).get()
            .then((res) => {
                const data = res.data();

                context.team = { ...data, id };

                this.loadPartials({
                    header: '../templates/common/header.hbs',
                    footer: '../templates/common/footer.hbs',
                    teamMember: '../templates/catalog/teamMember.hbs',
                    teamControls: '../templates/catalog/teamControls.hbs'
                })
                    .then(function () {
                        this.partial('../templates/catalog/details.hbs');
                    });
            })
            .catch(errorHandler);
    });
});

function hasUser() {
    const user = localStorage.getItem('user');

    return user ? JSON.parse(user) : null;
}

function saveUser(userData) {
    const { user: { email, uid } } = userData;
    localStorage.setItem('user', JSON.stringify({ email, uid }));
}

function successfullNotification() {
    info.textContent = 'The operation is successful';
    info.style.display = 'block';

    setTimeout(() => {
        info.style.display = 'none';
    }, 3000)
}

function errorHandler(error) {
    errorBox.textContent = error.message;
    errorBox.style.display = 'block';

    setTimeout(() => {
        errorBox.style.display = 'none';
    }, 3000)
}

(() => {
    app.run('#/home');
})()