/* global Vue */
/* global axios */
var app = new Vue({
    el: '#app',
    data: {
        products: [],
        cart: [],
    },
    created: function() {
        this.getProducts();
    },
    methods: {
        async getProducts() {
            try {
                let response = await axios.get('/api/get');
                this.products = response.data;
            } catch(err) {
                console.log(err);
            }
        },
        async toggleChecked(product) {
            console.log('called toggleChecked(' + product + ')');
            const url = '/api/checked/' + product._id;
            await axios.put(url);
            this.getProducts();
        },
        async purchase() {
            this.cart = [];
            await this.products.forEach(product => {
                if (product.checked) {
                    this.cart.push(product);
                    axios.put('/api/ordered/' + product._id);
                    axios.put('/api/uncheck/' + product._id);
                }
            });
            this.getProducts();
        },
    },
});