import { Products } from "./products.js";
export function Cart(email){
    const cartHTML = document.getElementById('cart');
    const user = email;
    let products = [];
    const empty = document.getElementById('empty');
    const items = document.getElementById('items');
    let cartsList = [];

    const cartsListString = localStorage.getItem('CARTS_LIST');
    if(cartsListString){
        cartsList = JSON.parse(cartsListString);
    }
    if(user){
        const cart = cartsList.find(cart => cart.user == user);
        if (!cart) {
            cartsList.push({ user: user, products: products });
        } else {
            products = cart.products;
        }
    }
    localStorage.setItem('CARTS_LIST', JSON.stringify(cartsList));
    empty.onclick = () => {
        removeAll();
    };
    console.log('USER-> ' + user);
    

    function removeAll(){
        products = [];
        render();
    }

    function addItem(id){
        if(!user){
            return false;
        }
        products.push(id);
        return true;
    }

    function removeItem(id){
        const index = products.indexOf(id);
        products.splice(index,1);
    }

    function removeItemsById(id){
        const updatedProducts = products.filter(product => product != id);
        products = updatedProducts;
    }

    function render(){
        items.innerHTML = '';
        const productsSet = new Set(products);
        for(const productid of productsSet){
            const productHTML = document.createElement('div');
            const product = Products.find(product => product.id == productid);
            const units = products.filter(product => product == productid).length;
            productHTML.className = 'inline space item';
            productHTML.innerHTML = `
                <p>x${units}</p>
                <h5 class="title">${product.name}</h5>
                <p class="price">${product.price} €</p>
            `;
            const {btnRmOne,btnAdd,btnRmAll} = btns(product);
            productHTML.appendChild(btnRmOne);
            productHTML.appendChild(btnAdd);
            productHTML.appendChild(btnRmAll);
            items.appendChild(productHTML);
        }
        const total = document.getElementById('total');
        const totalPrice = getTotalPrice();
        total.innerHTML = `${totalPrice} €`;
        updateCartsList();
        console.log('CART-> ' + products)
    }

    function getTotalPrice(){
        let prices = [];
        for(const item of products){
            prices.push((Number(Products.find(product => product.id == item).price)));
        }
        let totalPrice = prices.reduce((subtotal, price) => {return subtotal + price},0);
        totalPrice = totalPrice.toFixed(2);
        return totalPrice;
    }

    function btns(product){
        const btnRmOne = document.createElement('button');
        const btnAdd = document.createElement('button');
        const btnRmAll = document.createElement('button');
        btnRmOne.className = 'btn secondary removeOne';
        btnAdd.className = 'btn secondary addOne';
        btnRmAll.className = 'btn secondary removeAll';
        btnRmOne.setAttribute('idref',product.id);
        btnAdd.setAttribute('idref',product.id);
        btnRmAll.setAttribute('idref',product.id);
        btnRmOne.innerHTML = '<i class="fa-solid fa-minus"></i>';
        btnAdd.innerHTML = '<i class="fa-solid fa-plus"></i>';
        btnRmAll.innerHTML = '<i class="fa-solid fa-trash"></i>';
        btnRmOne.onclick = () => {
            removeItem(btnRmOne.attributes['idref'].value);
            render();
        };
        btnAdd.onclick = () => {
            addItem(btnAdd.attributes['idref'].value);
            render();
        };
        btnRmAll.onclick = () => {
            removeItemsById(btnAdd.attributes['idref'].value);
            render();
        };
        return {btnRmOne,btnAdd,btnRmAll}
    }

    function updateCartsList(){
        const cart = cartsList.find(cart => cart.user == user);
        if(cart){
            const index = cartsList.indexOf(cart);
            cart.products = products;
            cartsList[index] = cart;
            localStorage.setItem('CARTS_LIST',JSON.stringify(cartsList));
        }
    }

    return {render,removeAll,addItem,removeItemsById,removeItem}

}