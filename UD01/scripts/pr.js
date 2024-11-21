import { Cart } from "./cart.js";
import { content } from "./components.js";
import { Products } from "./products.js";



const shelf = document.getElementById('products')
const infoProduct = (product) => {
    const infoHTML = document.createElement('div');
        infoHTML.classList.add('box');
        infoHTML.innerHTML = `
            <div class="inline space">
                <h4>${product.name}</h4>
                <button class="btn tertiary add" idref=${product.id}><i class="fa-solid fa-cart-plus"></i></button>
                </div>
                <p>${product.price} €</p>
            </div>
        `;
    return infoHTML;
}
const imageDescription = (product) => {
    const imageHTML = document.createElement('div');
    imageHTML.classList.add('image-info');
    imageHTML.style.backgroundImage = `url(${product.image})`;
    const descriptionHTML = document.createElement('p');
    descriptionHTML.innerHTML = product.description;
    descriptionHTML.className = 'desc';
    imageHTML.appendChild(descriptionHTML);
    return imageHTML;
}
const products = (items = Products) => {
    shelf.innerHTML = '';
    const products = items;
    products.forEach(product => {
        const productHTML = document.createElement('article');
        productHTML.className = 'box product';
        productHTML.id = product.id;
        const imageHTML = imageDescription(product);
        const infoHTML = infoProduct(product)
        productHTML.appendChild(imageHTML);
        productHTML.appendChild(infoHTML);
        shelf.appendChild(productHTML);
    });
    const btns = document.getElementsByClassName('add');
    for (const btn of btns) {
        btn.onclick = () => {
            const productId = btn.attributes['idref'].value
            const itemAdded = currentCart.addItem(productId);
            if(!itemAdded){
                toast('You must sign in first!');
                displayForm();
            }else{
                currentCart.render();
                const productName = Products.find(product => product.id == productId).name
                toast(`${productName} added to your cart`,'success')
            }
        }
    }
}
products();

const signForm = document.getElementById('cardForm');
let isLogged = localStorage.getItem('CURRENT_USER');
const signLink = document.getElementById('signLink');
const bgForm = document.getElementById('bg');
const closeForm = document.getElementById('closeForm');

signLink.onclick = () => {
    document.getElementById('closeSideMenu').checked = true;
    if(isLogged){
        logout();
    }else{
        displayForm();
    }
}

const getCurrentUser = () => {
    const userString = localStorage.getItem('CURRENT_USER');
    if(userString){
        const user = JSON.parse(userString);
        return user
    }else{
        return null
    }
}

function displayForm(){
    signForm.className = 'displayForm';
    bgForm.style.opacity = '100';
    bgForm.style.top = '0'
}

function hideForm(){
    signForm.className = 'hideForm';
    bgForm.style.opacity = '0';
    setTimeout(() => {
        bgForm.style.top = '-100%'
    },800)
    
}


bgForm.addEventListener('mousedown',(event) => {
    if(event.target.id == 'bg'){
        hideForm();
    }
});


closeForm.onclick = () => {
    hideForm();
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
    if(isValid){
        const users = getUsers();
        if(userExists(users,email)){
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
    const exists = users.find(user => user.email == email);
    if(exists) return true
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
    const formValid = validForm(email,password);
    if(formValid){
        const users = getUsers();
        const user = users.find(user => user.email == email && user.password == password);
        if(user){
            logUser(user);
            clearForm(form);
        }else{
            toast('Email or password incorrect')
        }
    }
}
const logUser = (user) => {
    signLink.innerHTML = 'Log out <i class="fa-solid fa-right-from-bracket"></i>'
    isLogged = true;
    const userString = JSON.stringify(user);
    localStorage.setItem('CURRENT_USER',userString);
    hideForm();
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
    signLink.innerHTML = 'Sign in/Register';;
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

/* CARRITO */
let currentCart;
//SET currentCart TO THE CART OF THE USER LOGGED IN
const initCart = () => {
    const user = getCurrentUser();
    currentCart = user ? new Cart(user.email) : new Cart(null);
    currentCart.render();
}
initCart();

window.addEventListener('resize', () => {
    scrollUp.style.display = 'none';
})

openCart.onclick = () => {
    const cart = document.getElementById('cart');
    if(!isLogged){
        displayForm();
        toast('Sing in to start adding items to your cart!');
    }else{
        cart.style.right = '0';
        
    }
}
const closeCart = document.getElementById('closeCart');
closeCart.onclick = () => {
    const cart = document.getElementById('cart');
    cart.style.right = '-100vw';
}