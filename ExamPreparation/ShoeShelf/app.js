const userModel=firebase.auth();
const db=firebase.firestore();

const app = Sammy('#root', function () {
    this.use('Handlebars', 'hbs');

    this.get('#/home', function(context){
        db.collection('shoes').get()
        .then((res)=>{
            context.shoes=res.docs.map((x)=>{return {id: x.id, ...x.data()}});
            loadPartials(context)
            .then(function(){
                this.partial('./templates/home.hbs');
            });
        })
        .catch(errorHandler);
    });

    this.get('#/register', function(context){
        loadPartials(context)
        .then(function(){
            this.partial('./templates/register.hbs');
        });
    });

    this.post('#/register', function(context){
        const {email, password, rePassword}=context.params;

        if(!email || !password || !rePassword || password !== rePassword){
            return;
        }

        userModel.createUserWithEmailAndPassword(email, password)
        .then(()=>{
            this.redirect('#/home');
        })
        .catch(errorHandler);
    });

    this.get('#/login', function(context){
        loadPartials(context)
        .then(function(){
            this.partial('./templates/login.hbs');
        });
    });

    this.post('#/login', function(context){
        const {email, password}=context.params;

        userModel.signInWithEmailAndPassword(email, password)
        .then((user)=>{
            saveUser(user);
            this.redirect('#/home');
        })
        .catch(errorHandler);
    });

    this.get('#/logout', function(){
        userModel.signOut()
        .then(()=>{
            localStorage.removeItem('user');
            this.redirect('#/login');
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
        const {name, price, imageUrl, description, brand}=context.params;
        const {uid}=hasUser();
        const creator=uid;

        if(!name || !price || !imageUrl || !description || !brand){
            return;
        }

        db.collection('shoes').add({
            name,
            price,
            imageUrl,
            description,
            brand,
            creator,
            buyers:[]
        })
        .then(()=>{
            this.redirect('#/home');
        })
        .catch(errorHandler);
    });

    this.get('#/details/:id', function(context){
        const {id}=context.params;

        db.collection('shoes').doc(id).get()
        .then((res)=>{
            const data=res.data();
            const {uid}=hasUser();
            const creator=data.creator==uid;
            const index=data.buyers.indexOf(uid);
            const isBuyer=index > -1;

            context.shoe={id:id, ...res.data(), creator, isBuyer};
            loadPartials(context)
            .then(function(){
                this.partial('./templates/details.hbs');
            });
        })
        .catch(errorHandler);
    });

    this.get('#/delete/:id', function(context){
        const {id}=context.params;

        db.collection('shoes').doc(id).delete()
        .then(()=>{
            this.redirect('#/home');
        })
        .catch(errorHandler);
    });

    this.get('#/edit/:id', function(context){
        const {id}=context.params;

        db.collection('shoes').doc(id).get()
        .then((res)=>{
            context.shoe={id:id, ...res.data()};
            loadPartials(context)
            .then(function(){
                this.partial('./templates/edit.hbs');
            });
        })
        .catch(errorHandler);
    });

    this.post('#/edit/:id', function(context){
        const {id, name, price, imageUrl, description, brand}=context.params;

        db.collection('shoes').doc(id).get()
        .then((res)=>{
            return db.collection('shoes').doc(id).set({
                ...res.data(),
                name,
                price,
                imageUrl,
                description,
                brand
            });
        })
        .then(()=>{
            this.redirect(`#/details/${id}`);
        })
        .catch(errorHandler);
    });

    this.get('#/buy/:id', function(context){
        const {id}=context.params;
        const {uid}=hasUser();

        db.collection('shoes').doc(id).get()
        .then((res)=>{
            const data={...res.data()};
            data.buyers.push(uid);
            return db.collection('shoes').doc(id).set(data);
        })
        .then(()=>{
            this.redirect(`#/details/${id}`);
        })
        .catch(errorHandler);
    });
});

function loadPartials(context){
    const user=hasUser();
    const email=user ? user.email:'';

    context.isLogged=Boolean(user);
    context.email=email;

    return context.loadPartials({
        header: './templates/header.hbs',
        footer: './templates/footer.hbs'
    });
}

function errorHandler(error){
    alert(error.message);
}

function saveUser(userData){
    const {user:{email, uid}}=userData;

    localStorage.setItem('user', JSON.stringify({email, uid}));
}

function hasUser(){
    const user=localStorage.getItem('user');

    return user ? JSON.parse(user):null;
}

(() => {
    app.run('#/home');
})()