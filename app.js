import { content, footer, nav, products } from "./components.js";

nav();
footer();
products();

const signForm = document.getElementById('cardForm');
let isLogged = localStorage.getItem('CURRENT_USER');
const signLink = document.getElementById('signLink');
const bgForm = document.getElementById('bg');
const closeForm = document.getElementById('closeForm');

const getCurrentUser = () => {
    const userString = localStorage.getItem('CURRENT_USER');
    if(userString){
        const user = JSON.parse(userString);
        return user
    }else{
        return null
    }
}

//SET CARTS_LIST FOR FIRST TIME...
const cartsListString = localStorage.getItem('CARTS_LIST');
let cartsList;
if(!cartsListString){
    cartsList = [];
    localStorage.setItem('CARTS_LIST',JSON.stringify(cartsList));
}else{
    cartsList = JSON.parse(cartsListString);
}

let currentCart;
//SET currentCart TO THE CART OF THE USER LOGGED IN
const initCart = () => {
    let cart;
    if(isLogged){
        const user = getCurrentUser();
        const email = user.email;
        const cartExists = cartsList.filter(cart => cart.user == email);
        if(cartExists.length>0){
            cart = cartExists[0];
        }else{
            cart = {products: [],user: email};
            cartsList.push(cart);
            localStorage.setItem('CARTS_LIST',JSON.stringify(cartsList));
        }
    }else{
        cart = {products: [],user: null};
    }
    currentCart = cart;
    console.log(currentCart);
}
initCart();

const setSignLink = () => {
    if(isLogged){
        signLink.innerHTML = 'Log out';
        signLink.id = 'logged';
    }else{
        signLink.innerHTML = 'Sign in/Register';
        signLink.id = 'notLogged';
    }
}
setSignLink();

const toggleCardForm = (id) => {
    if(id == 'logged'){
        logout();
    }else if(id == 'notLogged'){
        signForm.className = 'displayForm';
        bgForm.style.zIndex = '10';
        bgForm.style.opacity = '100';
    }else if(id == 'bg' || id == 'closeForm'){
        signForm.className = 'hideForm';
        bgForm.style.zIndex = '-10';
        bgForm.style.opacity = '0';
    }
}

bgForm.addEventListener('mousedown',(event) => {
    const id = event.target.id;
    toggleCardForm(id);
});

signLink.addEventListener('click',(event) => {
    document.getElementById('close').checked = true;
    const id = event.target.id;
    toggleCardForm(id);
});

closeForm.onclick = () => {
    toggleCardForm(closeForm.id)
}

const register = document.getElementById('register');
register.onclick = () => {
    const form = {
        email: document.getElementById('reg-email'),
        password: document.getElementById('reg-password'),
        confirmPassword: document.getElementById('confirmPassword'),
        firstName: document.getElementById('first-name'),
        lastName:  document.getElementById('last-name'),

    }
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value
    const name = form.firstName.value.concat(` ${form.lastName.value}`);
    const isValid = validForm(email,password,confirmPassword,name);
    let exists;
    if(isValid){
        let users = getUsers();
        exists = userExists(users,email);
        if(exists){
            toast('Email already in use')
        }else{
            const user = {email: email,password: password,name: name};
            users.push(user);
            const usersString = JSON.stringify(users);
            localStorage.setItem('USERS_REGISTERED',usersString);
            toast('User registered. You can sign in now!','success');
            clearForm(form);
        }
    }
}

const userExists = (users,email) => {
    const exists = users.filter(user => user.email == email);
    if(exists.length > 0) return true
    return false
}

const clearForm = (form) => {
    form.email.value = "";
    form.password.value = "";
    form.confirmPassword.value = "";
    form.firstName.value = "";
    form.lastName.value = "";
}

const login = document.getElementById('login')
login.onclick = () => {
    const form = {
        email: document.getElementById('email'),
        password:document.getElementById('password')
    }
    const email = form.email.value;
    const password = form.password.value;
    const isValid = validForm(email,password);
    let userIsValid;
    if(isValid){
        const users = getUsers();
        for (const user of users) {
            if(user.email == email && user.password == password){
                logUser(user);
                clearForm(form);
                userIsValid = true;
                break;
            }
        }
        if(!userIsValid){
            toast('Email or password incorrect')
        }
    }
}

const logUser = (user) => {
    isLogged = true;
    const userString = JSON.stringify(user);
    localStorage.setItem('CURRENT_USER',userString);
    toggleCardForm('closeForm');
    setSignLink();
    initCart();
    toast(`Welcome ${user.name}!`,'success');
}

const validForm = (email,password,confirmPassword = password,name = 'default') => {
    if(!email || !password || !name){
        toast("You must fill up all the fields correctly")
        return false
    }
    if(password != confirmPassword) {
        toast("Passwords doesn't match");
        return false
    }
    if(password.length < 8 && name != 'default'){
        toast("Passwords must have at least 8 characters")
        return false
    }
    return true
}


const logout = () => {
    const user = getCurrentUser();
    localStorage.removeItem('CURRENT_USER');
    isLogged = false;
    setSignLink();
    initCart();
    toast(`See you later ${user.name}`,'success');
}
const toast = (msg,type = 'error') => {
    console.log(msg)
    const container = document.createElement('div');
    container.innerHTML = msg;
    container.className = `toast ${type}`;
    container.id = 'toast';
    content.appendChild(container);
    setTimeout(() => {
        content.removeChild(document.getElementById('toast'));
    },2000)
}


const getUsers = () => {
    const usersString = localStorage.getItem('USERS_REGISTERED');
    const users = JSON.parse(usersString);
    if(users) return users
    return []
}
//CARRITO
const addBtns = document.getElementsByClassName('add');
for (const btn of addBtns) {
    btn.onclick = () => {
        const productId = btn.attributes['idref'].value
        updateCart(productId)
    }
}

const updateCart = (id) => {
    if(currentCart.user != null){
        currentCart.products.push(id);
        updateCartsList(currentCart);
    }else{
        toast('You must sign in first!');
        toggleCardForm('notLogged');
    }
}
const updateCartsList = (cart) => {
    let updatedCartList =  cartsList.map(cart => {
        if(cart.user == currentCart.user){
            return currentCart;
        }else{
            return cart;
        }
    });
    cartsList = updatedCartList;
    localStorage.setItem('CARTS_LIST',JSON.stringify(cartsList));
}

//TODO: AGREGAR ASTERISCO EN CAMPOS OBLIGATORIOS DE REGISTER...
//TODO: ESTILAR FORM
//TODO: PINTAR EL CARRO...
//TODO: ESTILAR CARRO, SECCIONES, ETC...
//TODO: AGREGAR ICONITO VER PASSWORD