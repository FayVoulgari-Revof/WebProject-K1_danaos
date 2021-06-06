const express= require ('express');
const app=express(); // Δίνουμε access στο app σε όλες τις express fumnctions
const Router = require('./routes.js');
const exphbs = require('express-handlebars');
const session=require('express-session');
const {pool}=require('./lib/dbconfig');
const pgSession = require('connect-pg-simple')(session)

//Αρχικοποιούμε το session το οποίο θα καταστραφεί είτε με logout του χρήστη είτε έπειτα απο το maxAge
app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session'
    }),
    secret: 'secret',
    cookie: {
      maxAge: 60 * 1000 * 60 
  },
    resave: false,
    saveUninitialized: false,

   
  }));
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(express.json());
app.use('/',Router);

var hbs = exphbs.create({});

//Αρχικοποιούμε τους helper 
hbs.handlebars.registerHelper('isMore', function (value) {  
    if(value>0)return true;
    else return false
  });

  hbs.handlebars.registerHelper('isNull', function (value) {
    
      if(value == null)return true;
      else return false
    });
    
  hbs.handlebars.registerHelper('isTrue', function (value) {
    
    if(value == true)return true;
    else return false
  });
  

app.engine('hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'layout'
}));


app.set('view engine', 'hbs');

module.exports = app;
