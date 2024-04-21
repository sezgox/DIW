export class Cart{

    user = null;
    products = [];

    constructor(cart){
        this.user = cart.user;
        this.products = cart.products;
        console.log('USER-> ' + this.user + ' CART-> ' + this.products)
    }

    addItem(id){
        if(!this.user){
            return false;
        }
        this.products.push(id);
        console.log('CART-> ' + this.products)
        return true;
    }

    removeItem(id){
        const index = this.products.indexOf(id);
        this.products.splice(index,1);
        console.log('CART-> ' + this.products)
    }

    removeAllItemsById(id){
        const products = this.products.filter(product => product != id)
        this.products = products;
        console.log('CART-> ' + this.products)
    }

    removeAll(){
        this.products = [];
        console.log('CART-> ' + this.products)
    }

}