const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 3000;
const categoryRouter = require('./routes/category');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');
const userRouter = require('./routes/user');
const brandRouter = require('./routes/brand');
const authorRouter = require('./routes/author');
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',(req, res)=>{
	res.send('Hello, Nguyễn Công Đức')
})
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter);
app.use('/api/user', userRouter);
app.use('/api/brand', brandRouter);
app.use('/api/author', authorRouter);
mongoose.connect('mongodb://root:123456789@ds237967.mlab.com:37967/meanecom',{useMongoClient:true});

app.listen(port, ()=>{
	console.log('server connected 3000');
});
