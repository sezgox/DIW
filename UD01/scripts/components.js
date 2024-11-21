export const content = document.getElementById('content');
export const nav = () => {

    const navbar = document.createElement('nav');
    navbar.innerHTML = `
    <label for="openSideMenu"><i class="fa-solid fa-bars"></i></label>
    <input type="radio" name="drop-menu" id="closeSideMenu" checked>
    <input type="radio" name="drop-menu" id="openSideMenu">
    <label for="closeSideMenu" class="close"><i class="fa-solid fa-xmark"></i></label>
    <div class="menu-content" >
        <ul>
            <li>
                <a href="index.html">Home</i></a>
            </li>
            <li>
                <a href="products.html">Products</a>
            </li>
            <li>
                <a style="cursor:pointer">Locations</a>
            </li>
            <li>
                <a style="cursor:pointer">Contact us</a>
            </li>
            <li>
            <a style="cursor:pointer" id="openCart"></a>
            <li>
                <div class="input"><i class="fa-solid fa-magnifying-glass search-icon" style="margin-left: 8px;"></i> <input type="search" placeholder="Search for products..." class="searchbar"></div>
            </li>
            </li>
            <li>
                <a id="signLink" style="cursor:pointer"></a>
            </li>
        </ul>
    </div>
    `;
    navbar.id = 'menu';
    content.appendChild(navbar);
}

export const footer = () => {
    const footer = document.createElement('footer');
    footer.innerHTML = `
    <div class="inline">
        <div class="box">
            <h4>HELP & INFORMATION</h4>
            <div class="box">
                <p><a href="faq.html">FAQ</a></p>
                <p><a href="">Offers</a></p>
                <p><a href="">Premium</a></p>
            </div>
        </div>
        <div class="box">
            <h4>ABOUT US</h4>
            <div class="box">
                <p><a href="">About us</a></p>
                <p><a href="">Career</a></p>
            </div>
        </div>
    </div>
    <p>Powered by cocaine</p>
    `;
    footer.classList.add('box');
    content.appendChild(footer);
}

export const linkActive = () => {
    const pathname = window.location.pathname;
    const navlinks = document.querySelectorAll('#menu a');
    navlinks.forEach(navlinkEl => {
        if(navlinkEl.href.includes(pathname)){
            navlinkEl.style.textDecoration = 'underline';
        }
    });
}

nav();
footer();
window.onload = () => {
    linkActive();
}
const signLink = document.getElementById('signLink');
signLink.innerHTML = localStorage.getItem('CURRENT_USER')==null ? 'Sign in/Register' : 'Log out <i class="fa-solid fa-right-from-bracket"></i>';

const openCart = document.getElementById('openCart');
openCart.innerHTML = window.innerWidth >= 1024 ? '<i class="fa-solid fa-cart-shopping" style="color: #ffffff;"></i>' : 'Cart';
window.addEventListener('resize', function() {
    openCart.innerHTML = window.innerWidth >= 1024 ? '<i class="fa-solid fa-cart-shopping" style="color: #ffffff;"></i>' : 'Cart';
});


function search(){
    const searchIcon = document.querySelector('.search-icon');
    const searchbar = document.querySelector('.searchbar');
    searchIcon.style.color = 'black';
    console.log(searchIcon.style.color)
    searchbar.addEventListener('focus', () => {
        searchIcon.style.color = 'var(--primary)';
    });
    searchbar.addEventListener('blur', () => {
        searchIcon.style.color = 'black';
    });
    
}

search();