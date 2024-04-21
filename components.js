import { Products } from "./products.js";
export const content = document.getElementById('content');
const shelf = document.getElementById('products')
export const nav = () => {

    const navbar = document.createElement('nav');
    navbar.innerHTML = `
    <label for="open"><i class="fa-solid fa-bars"></i></label>
    <input type="radio" name="drop-menu" id="close" checked>
    <input type="radio" name="drop-menu" id="open">
    <label for="close" class="close"><i class="fa-solid fa-xmark"></i></label>
    <div class="menu-content" >
        <ul>
            <li>
                <a href="/index.html">Home</i></a>
            </li>
            <li>
                <a href="#">Products</a>
            </li>
            <li>
                <a href="">Locations</a>
            </li>
            <li>
                <a href="#">Contact us</a>
            </li>
            <li>
                <a id="signLink" href="##"></a>
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
                <p><a>FAQ</a></p>
                <p>Offers</p>
                <p>Premium</p>
            </div>
        </div>
        <div class="box">
            <h4>ABOUT US</h4>
            <div class="box">
                <p>About us</p>
                <p>Career</p>
            </div>
        </div>
    </div>
    <p>Powered by cocaine</p>
    `;
    footer.classList.add('box');
    content.appendChild(footer);
}
const infoProduct = (product) => {
    const infoHTML = document.createElement('div');
        infoHTML.classList.add('box');
        infoHTML.innerHTML = `
            <div class="inline space">
                <h4>${product.name}</h4>
                <button class="small add" idref=${product.id}><i class="fa-solid fa-plus"></i></button>
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
    const descriptionHTML = document.createElement('ul');
        product.description.forEach(el => {
            const elHTML = document.createElement('li');
            elHTML.innerHTML = `${el}`;
            descriptionHTML.appendChild(elHTML);
        });
    imageHTML.appendChild(descriptionHTML);
    return imageHTML;
}
export const products = () => {
    const products = Products;
    products.forEach(product => {
        const productHTML = document.createElement('article');
        productHTML.className = 'box product';
        productHTML.id = product.id;
        const imageHTML = imageDescription(product);
        const infoHTML = infoProduct(product)
        productHTML.appendChild(imageHTML);
        productHTML.appendChild(infoHTML);
        shelf.appendChild(productHTML)
    });
}
