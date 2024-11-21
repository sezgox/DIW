import { Cart } from "./cart.js";
import { content, linkActive } from "./components.js";
import { Products } from "./products.js";

const loginForm = document.forms.login;
const regForm = document.forms.register;

[loginForm, regForm].forEach(form => {
    for(let input of form){
        if(input.type != 'button'){
            input.addEventListener('focus', () => {
                input.parentNode.classList.add('focus');
            })
            input.addEventListener('blur', () => {
                input.parentNode.classList.remove('focus');
            })
        }
    }
})


const shelf = document.getElementById('products')
const infoProduct = (product) => {
    const infoHTML = document.createElement('div');
        infoHTML.classList.add('box');
        infoHTML.innerHTML = `
            <div class="inline space">
                <h4>${product.name}</h4>
                <button class="btn clear" idref=${product.id}><i class="fa-solid fa-cart-plus"></i></button>
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
    const explore = document.createElement('article');
    explore.style.alignContent = 'center';
    explore.className = 'product explore';
    explore.innerHTML = '<h2 style="text-align:center">Explore more products <i class="fa-solid fa-arrow-right"></i></h2>'
    explore.onclick = () => {
        window.location.href = '/htmls/products.html'
    }
    shelf.appendChild(explore)
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
    bgForm.style.display = 'block';
    setTimeout(()=>{
        signForm.className = 'displayForm';
        bgForm.style.opacity = '100';
        bgForm.style.top = '0'
    },100)
}

function hideForm(){
    signForm.className = 'hideForm';
    bgForm.style.opacity = '0';
    setTimeout(() => {
        bgForm.style.top = '-100%'
    },800)
    setTimeout(() => {
        bgForm.style.display = 'none';
    },850)
    
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
register.addEventListener('click',() => {
    const form = regForm;
    const isValid = validForm(form);
    if(isValid){
        const name = `${form.firstName.value} ${form.lastName.value}`;
        const users = getUsers();
        if(userExists(users,form.regEmail.value)){
            toast('Email already in use')
        }else{
            const user = {email: form.regEmail.value,password: form.regPassword.value,name: name};
            users.push(user);
            const usersString = JSON.stringify(users);
            localStorage.setItem('USERS_REGISTERED',usersString);
            toast('User registered. You can sign in now!','success');
            clearForm(form);
        }
    }
})
const userExists = (users,email) => {
    const exists = users.find(user => user.email == email);
    if(exists) return true
    return false
}
const clearForm = (form) => {
    form.email.value = "";
    form.password.value = "";
    form.regPassword.value = "";
    form.confirmPassword.value = "";
    form.address.value = "";
    form.firstName.value = "";
    form.lastName.value = "";
}
const login = document.getElementById('login')
login.onclick = () => {
    const form = loginForm;
    const formValid = validForm(form,'login');
    if(formValid){
        const users = getUsers();
        const user = users.find(user => user.email == form.email.value && user.password == form.password.value);
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
const validForm = (form,type = 'register') => {
    if(type == 'register'){
        if(!form.firstName.checkValidity()){
            toast('First name is mandatory');
            form.firstName.focus()
            return false
        }
        if(form.address.validity.tooShort){
            toast("Address must be at least 10 characters")
            form.address.focus()
            return false
        }
        if(!form.regEmail.checkValidity()){
            form.regEmail.focus()
            toast('Enter a valid email')
            return false
        }if(form.regPassword.validity.tooShort){
            form.regPassword.focus()
            toast("Passwords must have at least 8 characters")
            return false
        }if(form.regPassword.value !== form.confirmPassword.value){
            form.regPassword.focus()
            toast("Passwords must match");
            return false
        }
        return true
    }else{
        if(!form.email.checkValidity() || !form.password.checkValidity()){
            toast("You must fill up all the fields correctly")
            return false
        }
        return true
    }
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
        toast('Sign in to start adding items to your cart!');
    }else{
        cart.style.right = '0';
        
    }
}
const closeCart = document.getElementById('closeCart');
closeCart.onclick = () => {
    const cart = document.getElementById('cart');
    cart.style.right = '-100vw';
}

/* NAVBAR SCROLL ANIMATION */
const scrollUp = document.createElement('img');
scrollUp.src = '../assets/images.png';
scrollUp.className = 'burbuja';
content.appendChild(scrollUp)
scrollUp.onclick = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    }); 
    navbar.style.top = '0';
}
const navbar = document.getElementById ('menu');
let lastScrollPosition = 0;
//const triggerPoint = document.querySelector('main').getBoundingClientRect().top;
window.addEventListener('scroll', () => {

    const scrollPosition = window.scrollY;

    if(lastScrollPosition < scrollPosition){

        if(scrollPosition > window.innerHeight*0.9){
            navbar.style.top = '-100px';
        }

    }else if(lastScrollPosition > scrollPosition && scrollPosition <=  window.innerHeight){
        scrollUp.style.display = 'none';
    }else{
        navbar.style.top = '0px';
    }
    if(scrollPosition >  window.innerHeight &&  window.innerWidth >= 1024){
        scrollUp.style.display = 'block'
    }
    
    lastScrollPosition = scrollPosition;
})
/* STYLE FOR ACTIVE LINK */

/* FILTROS */
const analBtn = document.getElementById('anal');
const vaginalBtn = document.getElementById('vaginal');
const coupleBtn = document.getElementById('couple');
const allBtn = document.getElementById('all');

analBtn.onclick = () => {
    const filter = Products.filter(product => product.category.includes(analBtn.id));
    removeClass();
    products(filter);
    analBtn.classList.add('btn-active');
}
vaginalBtn.onclick = () => {
    const filter = Products.filter(product => product.category.includes(vaginalBtn.id));
    removeClass();
    products(filter);
    vaginalBtn.classList.add('btn-active');
}
coupleBtn.onclick = () => {
    const filter = Products.filter(product => product.category.includes(coupleBtn.id));
    removeClass();
    products(filter);
    coupleBtn.classList.add('btn-active');
}
allBtn.onclick = () => {
    products();
    removeClass();
    allBtn.classList.add('btn-active');
}
function removeClass() {
    [analBtn, vaginalBtn, coupleBtn, allBtn].forEach(btn => {
        btn.classList.remove('btn-active');
    });
}

window.onload = () => {
    linkActive();

    if(localStorage.getItem('DISCLAIMER')!=='TRUE'){
        const bodyHTML = document.querySelector('body');
        const disclaimerBg = document.createElement('div');
        const disclaimerCard = document.createElement('div');
        disclaimerBg.className = 'bg disclaimerBg';
        const title = document.createElement('h2');
        title.textContent = '***DISCLAIMER***';
        const description = document.createElement('p');
        description.textContent = 'THIS PAGE CONTAINS DOCUMENTS WITH ADULT LANGUAGE AND CONTENT. IT IS NOT SUITABLE FOR ANYONE UNDER THE AGE OF 18 AND MAY NOT BE SUITABLE FOR ALL ADULT READERS. ALSO, ALL PRODUCTS DETAILS, EVEN THOSE BASED ON REAL ONES, ARE ENTIRELY FICTIONAL AND USED FOR THE PURPOSE OF REVIEW, CRITIQUE AND PARODY UNDER THE TERMS OF FAIR USE. VIEW AT YOUR DISCRETION.'
        const btns = document.createElement('div');
        btns.className = 'inline';
        btns.style.margin = 'auto';
        btns.style.width = '50%'
        const accept = document.createElement('button');
        accept.className = 'btn other';
        accept.textContent = 'Accept';
        const decline = document.createElement('button');
        decline.className = 'btn other';
        decline.textContent = 'Decline';
        
        disclaimerCard.className = 'disclaimer';
        disclaimerCard.appendChild(title);
        disclaimerCard.appendChild(description);
        btns.appendChild(accept);
        btns.appendChild(decline);
        disclaimerCard.appendChild(btns);

        disclaimerBg.appendChild(disclaimerCard);

        bodyHTML.appendChild(disclaimerBg);

        accept.onclick = () => {
            disclaimerCard.style.opacity = '0';
            disclaimerCard.style.position = 'fixed';
            disclaimerCard.style.top = '-100%'
            disclaimerCard.style.top = '-100%';
            disclaimerBg.style.backdropFilter = 'blur(5px)';
            localStorage.setItem('DISCLAIMER','TRUE');
            setTimeout(()=> {
                disclaimerBg.style.display = 'none';
            },500);
        }
        decline.onclick = () => {
            localStorage.setItem('DISCLAIMER','FALSE');
            window.location.href = "https://www.quora.com/If-sex-is-so-loved-by-the-world-then-why-are-people-offended-by-it"
        }
    }
}

const showPassIcon = document.getElementById('showPass');
const showRegPassIcon = document.getElementById('showRegPass');
const showConfirmIcon = document.getElementById('showConfirm');


function togglePassword(input,icon){
    if(input.type == 'password'){
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    }else{
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

showPassIcon.addEventListener('click',() => {
    const password = loginForm.password;
    togglePassword(password,showPass);
})
showRegPassIcon.addEventListener('click',() => {
    const password = regForm.regPassword;
    togglePassword(password,showRegPass);
})
showConfirmIcon.addEventListener('click',() => {
    const password = regForm.confirmPassword;
    togglePassword(password,showConfirmIcon);
})