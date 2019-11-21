var express = require('express');
var router = express.Router();
const multer = require('multer')
const mongoose = require('mongoose');
const upload = multer({
  dest: './public/images/',
  limits: {
    fileSize: 10000000
  }
});

mongoose.connect('mongodb://localhost:27017/store', { useNewUrlParser: true });

const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  path: String,
  ordered: Number,
  checked: Boolean
});
const Product = mongoose.model('Product', productSchema);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/get', async (req, res) => {
    console.log('in GET /api/get');
    try {
        let products = await Product.find();
        res.send(products);
    } catch(err) {
        console.log(err);
    }
});

router.post('/api/photos', upload.single('photo'), async (req, res) => {
  console.log('in POST /api/photos');
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

router.post('/api/products', async (req, res) => {
  console.log('in POST api/products');
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    path: req.body.path,
    ordered: req.body.ordered,
    checked: false
  });
  try {
    await product.save();
    res.send(product);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.put('/api/checked/:id', async (req, res) => {
    console.log('in PUT /api/checked/:id');
    var id = { _id: req.params.id };
    let product = await Product.findOne(id);
    if (product.checked == true) {
        product.checked = false;
        console.log('unchecked');
    } else {
        product.checked = true;
        console.log('checked');
    }
    try {
        await product.save();
        res.send(product);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.put('/api/ordered/:id', async (req, res) => {
    console.log('in PUT /api/votes/:id');
    console.log(req.params.id);
    var id = { _id: req.params.id };
    let product = await Product.findOne(id);
    product.ordered++;
    try {
        await product.save();
        res.send(product);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.put('/api/uncheck/:id', async (req, res) => {
    console.log('in PUT /api/uncheck');
    var id = { _id: req.params.id };
    let product = await Product.findOne(id);
    product.checked = false;
    try {
        await product.save();
        res.send(product);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.delete('/api/products/:id', async (req, res) => {
    console.log('in DELETE /api/products/:id');
    var product = { _id: req.params.id };
    Product.deleteOne(product, (err, obj) => {
        if (err) throw err;
        console.log('id: ' + req.params.id + ' deleted');
    });
    res.end('{"Success":"Updated Successfully", "Status": 200}');
});

module.exports = router;