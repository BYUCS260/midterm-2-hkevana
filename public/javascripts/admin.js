/* global Vue */
/* global axios */
var admin = new Vue({
    el: '#admin',
    data: {
        name: null,
        price: null,
        file: null,
        products: [],
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
        fileChanged(event) {
            this.file = event.target.files[0];
        },
        async upload() {
            try {
                const formData = new FormData();
                formData.append('photo', this.file, this.file.name);
                let r1 = await axios.post('/api/photos', formData);
                let r2 = await axios.post('/api/products', {
                    name: this.name,
                    price: this.price,
                    path: r1.data.path,
                    ordered: 0
                });
                this.getProducts();
                console.log(this.products);
            }
            catch (error) {
                console.log(error);
            }
        },
        async deleteItem(item) {
            try {
                const response = await axios.delete('api/products/' + item._id);
                this.getProducts();
                return true;
            } catch(err) {
                console.log(err);
            }
        },
    },
});