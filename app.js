import { content, footer, nav, products } from "./components.js";

nav();
footer();
products();

const signForm = document.getElementById('cardForm');
let isLogged = localStorage.getItem('CURRENT_USER');
const signLink = document.getElementById('signLink');
const bgForm = document.getElementById('bg');
const closeForm = document.getElementById('closeForm')

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
        bgForm.style.zIndex = '0';
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
    if(!isValid){
        //TODO: CAMPOS INVALIDOS...
        console.log('YOU MUST FILL UP THE FIELDS CORRECTLY')
    }else{
        let users = getUsers();
        exists = userExists(users,email);
        if(exists){
            toast('Email already in use')
        }else{
            const user = {email: email,password: password,name: name};
            users.push(user);
            const usersString = JSON.stringify(users);
            localStorage.setItem('USERS_REGISTERED',usersString);
            toast('User registered. You can sign in now!');
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
                setSignLink();
                userIsValid = true
                successLog(user);
                clearForm(form);
                break;
            }
        }
        if(!userIsValid){
            toast('Email or password incorrect')
            console.log('Email o contraseña incorrectas')
        }
    }else{
       //TODO: CAMPOS INVALIDOS...
    }
}

const logUser = (user) => {
    isLogged = true;
    const userString = JSON.stringify(user);
    localStorage.setItem('CURRENT_USER',userString);
}

//PARA MOSTRAR MENSAJES DE ERROR...
const validForm = (email,password,confirmPassword = password,name = 'default') => {
    //TODO: AGREGAR LOGICA PARA MANEJAR CUANDO NO SEA VALIDO EL FORMULARIO
    return true
}

const logout = () => {
    const user = getCurrentUser();
    localStorage.removeItem('CURRENT_USER');
    isLogged = false;
    setSignLink();
    toast(`See you later ${user.name}`);
}

const successLog = (user) => {
    toggleCardForm('closeForm');
    toast(`Welcome ${user.name}!`);
}

const toast = (msg) => {
    console.log(msg)
    const container = document.createElement('div');
    container.innerHTML = msg;
    container.className = 'toast';
    container.id = 'toast';
    content.appendChild(container);
    setTimeout(() => {
        content.removeChild(document.getElementById('toast'));
    },2000).th
    
}

const getCurrentUser = () => {
    const userString = localStorage.getItem('CURRENT_USER');
    const user = JSON.parse(userString);
    return user
}
const getUsers = () => {
    const usersString = localStorage.getItem('USERS_REGISTERED');
    const users = JSON.parse(usersString);
    if(users) return users
    return []
}

