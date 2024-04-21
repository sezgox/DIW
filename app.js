import { Cart } from "./cart.js";
import { content, footer, nav, products } from "./components.js";
import { Products } from "./products.js";

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
const cart = document.getElementById('cart');
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
    clearCart();
    currentCart = new Cart(cart);
    getTotalPrice();
    for(const product of currentCart.products){
        renderCart(product);
    }
}
initCart();

const addBtns = document.getElementsByClassName('add');
for (const btn of addBtns) {
    btn.onclick = () => {
        const productId = btn.attributes['idref'].value
        const itemAdded = currentCart.addItem(productId);
        if(!itemAdded){
            toast('You must sign in first!');
            toggleCardForm('notLogged');
        }else{
            renderCart(productId);
            updateCartsList();
        }
    }
}
function updateCartsList(){
    let updatedCartList =  cartsList.map(cart => {
        if(cart.user == currentCart.user){
            return currentCart;
        }else{
            return cart;
        }
    });
    cartsList = updatedCartList;
    localStorage.setItem('CARTS_LIST',JSON.stringify(cartsList));
    getTotalPrice();
}

function updateBtns(){
    const removeAllBtns = document.getElementsByClassName('removeAll');
    const removeOneBtns = document.getElementsByClassName('removeOne');
    const addOneBtns = document.getElementsByClassName('addOne');
    for(const btn of removeAllBtns){
        btn.onclick = () => {
            const productId = btn.attributes['idref'].value
            currentCart.removeAllItemsById(productId);
            removeAllItemsById(productId);
        }
    }
    for(const btn of removeOneBtns){
        btn.onclick = () => {
            const productId = btn.attributes['idref'].value
            currentCart.removeItem(productId);
            renderCart(productId,'remove');
        }
    }
    for(const btn of addOneBtns){
        btn.onclick = () => {
            const productId = btn.attributes['idref'].value
            currentCart.addItem(productId);
            renderCart(productId);
        }
    }
}

function removeAllItemsById(id){
    const product = Products.filter(product => product.id == id)[0];
    let productHTML;
    for(const title of document.getElementsByClassName('title')){
        if(title.innerHTML == product.name){
            productHTML = title.parentElement;
            productHTML.remove();
        }
    }
    updateCartsList();
}

function renderCart(id,cartAction = 'add'){
    const product = Products.filter(product => product.id == id)[0];
    try {
        let titleHTML;
        for(const title of document.getElementsByClassName('title')){
            if(title.innerHTML == product.name){
                titleHTML = title;
            }
        }
        const unitsHTML = titleHTML.previousElementSibling;
        const priceHTML = titleHTML.nextElementSibling;
        let units;
        if(cartAction == 'add'){
            units = Number(unitsHTML.innerHTML.slice(1)) + 1;
        }else if(cartAction == 'remove'){
            units = Number(unitsHTML.innerHTML.slice(1)) - 1;
            if(units == 0){
                removeAllItemsById(id);
            }
        }
        unitsHTML.innerHTML =`x${units}`;
        const price = (Number(product.price)*units).toFixed(2);
        priceHTML.innerHTML = `${price} €`;
    } catch (error) {
        const productHTML = document.createElement('div');
        productHTML.className = 'inline space item';
        productHTML.innerHTML = `
            <p>x1</p>
            <h5 class="title">${product.name}</h5>
            <p class="price">${product.price} €</p>
            
            <button class="small removeOne" idref="${product.id}"><i class="fa-solid fa-minus"></i></button>
            <button class="small addOne" idref="${product.id}"><i class="fa-solid fa-plus"></i></button>
            <button class="small removeAll" idref="${product.id}"><i class="fa-solid fa-xmark"></i></button>
        `;
        cart.appendChild(productHTML);
        updateBtns();
    }
    updateCartsList();
}

function getTotalPrice(){
    const total = document.getElementById('total');
    let totalPrice = (0.00);
    for(const item of currentCart.products){
        const price = (Number(Products.filter(product => product.id == item)[0].price))
        totalPrice += price;
    }
    totalPrice = totalPrice.toFixed(2);
    total.innerHTML = `${totalPrice} €`;
}

const empty = document.getElementById('empty');
empty.onclick = () =>{
    clearCart();
    currentCart.removeAll();
    updateCartsList();
}

function clearCart(){
    const productsHTML = Array.from(document.getElementsByClassName('inline space item'));
    for(const productHTML of productsHTML){
        productHTML.remove();
    }
}




//TODO: AGREGAR ASTERISCO EN CAMPOS OBLIGATORIOS DE REGISTER...
//TODO: ESTILAR FORM...
//TODO: ESTILAR EL CARRO...
//TODO: ESTILAR SECCIONES...
//TODO: AGREGAR ICONITO VER PASSWORD
