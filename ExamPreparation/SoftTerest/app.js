const userModel = firebase.auth();
const db = firebase.firestore();
const errorBox = document.getElementById('errorBox');
const successBox = document.getElementById('successBox');
const loadingBox = document.getElementById('loadingBox');

const app = Sammy('#root', function () {
    this.use('Handlebars', 'hbs');

    this.get('#/home', function (context) {
        loadPartials(context)
            .then(function () {
                this.partial('./templates/home.hbs');
            });
    });

    this.get('#/register', function (context) {
        loadPartials(context)
            .then(function () {
                this.partial('./templates/register.hbs');
            });
    });

    this.post('#/register', function (context) {
        const { email, password, repeatPassword } = context.params;

        if (password !== repeatPassword) {
            errorHandler();
            return;
        }

        userModel.createUserWithEmailAndPassword(email, password)
            .then(() => {
                successOperation('User registration successful.');
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
                successOperation('Login successful.');
                this.redirect('#/home');
            })
            .catch(errorHandler);
    });

    this.get('#/logout', function (context) {
        userModel.signOut()
            .then(() => {
                localStorage.removeItem('user');
                successOperation('Logout successful.');
                this.redirect('#/home');
            })
            .catch(errorHandler);
    });

    this.get('#/dashboard', function(context){
        db.collection('ideas').get()
        .then((res)=>{
            context.ideas=res.docs.map((x)=>{return {id: x.id, ...x.data()}});
            loadPartials(context)
            .then(function(){
                this.partial('./templates/dashboard.hbs');
            });
        })
        .catch(errorHandler);
    });

    this.get('#/create', function(context){
        loadPartials(context)
        .then(function(){
            this.partial('./templates/create.hbs');
        });
    });

    this.post('#/create', function(context){
        const {title, description, imageURL}=context.params;
        const creator=JSON.parse(localStorage.getItem('user'));
        const uid=creator.uid;

        db.collection('ideas').add({
            title,
            description,
            imageURL,
            creator: uid,
            likes:[],
            comments:[]
        })
        .then(()=>{
            successOperation('Idea created successfully!');
            this.redirect('#/dashboard');
        })
        .catch(errorHandler);
    });

    this.get('#/details/:id', function(context){
        const {id}=context.params;

        db.collection('ideas').doc(id).get()
        .then((res)=>{
            const data=res.data();
            const {uid}=hasUser();
            const creator=data.creator===uid;
            context.idea={id:id, creator, ...data};
            loadPartials(context)
            .then(function(){
                this.partial('./templates/details.hbs');
            })
        })
        .catch(errorHandler);
    });

    this.get('#/delete/:id', function(context){
        const {id}=context.params;

        db.collection('ideas').doc(id).delete()
        .then(()=>{
            successOperation('Idea deleted successfully.');
            this.redirect('#/dashboard');
        })
        .catch(errorHandler);
    });
});

function saveUser(userData) {
    const { user: { email, uid } } = userData;
    localStorage.setItem('user', JSON.stringify({ email, uid }));
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

function successOperation(message) {
    successBox.textContent = message;
    successBox.style.display = 'block';

    setTimeout(() => {
        successBox.style.display = 'none';
    }, 3000)
}

function errorHandler(error) {
    if (!error) {
        errorBox.textContent = 'Invalid email/password!';
    }
    else {
        errorBox.textContent = error.message;
    }

    errorBox.style.display = 'block';

    setTimeout(() => {
        errorBox.style.display = 'none';
    }, 3000);
}

function hasUser() {
    const user = localStorage.getItem('user');

    return user ? JSON.parse(user) : null;
}

(() => {
    app.run('#/home');
})();