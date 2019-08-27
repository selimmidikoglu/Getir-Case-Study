const express = require ('express');
const app = express ();
const mongoose = require('mongoose')
const morgan = require('morgan');
const bodyParser = require('body-parser');
mongoose.connect ("mongodb://dbUser:dbPassword1@ds249623.mlab.com:49623/getir-case-study",{useNewUrlParser: true})



app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const filterRoutes = require ('./src/routes/filter');

app.use ('/filter', filterRoutes);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if(req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE');
      return res.status(200).json({});
  }
});
app.use((req,res,next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error,req,res,next) => {
  res.status(error.status || 500);
  res.json({
      error: {
          messagee: error.message
      }
  });
});

module.exports = app;
