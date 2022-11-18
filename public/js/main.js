const express = require('express');
const session = require('express-session')
const passport = require('passport')
const app = express();
const path = require('path');
const mongoose = require("mongoose")
const MongoStore = require('connect-mongo');
require("dotenv").config()


app.locals.basedir = path.join(__dirname, '../')
app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'pug');
app.use(express.static('public'));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(session({
	secret: "pay pay pay",
	resave: false,
	saveUninitialized: false,
	cookie: {},
	store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL })
}))

app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')

app.get('/', (req, res) => {
	res.render('homepage');
});

// Test admin page
app.get('/admin', (req, res) => {
	res.render('admin/admin')
})

app.use('/account', require('../../routes/account.route.js'))

app.use('/user', require("../../routes/user.route"))

app.use((req, res) => {
	res.status(404).render('../views/errors/error_page', { error_title: '404 - Not Found', error_code: '404', error_header: "Oops! You weren't suppose to see this", error_des: "The page you're looking for no longer exists." });
});

app.use((err, req, res, next) => {
	res.status(500).render('../views/errors/error_page', { error_title: '500 - Server Error', error_code: '500', error_header: "Uh oh! I think i broke it. Please report me to the system administrator!", error_des: "Internal Server Error" });
})

const server = app.listen(process.env.PORT || 3000, () => {
	mongoose.connect(process.env.DATABASE_URL)
	console.log(`The application started on http://localhost:${process.env.PORT}/`);
});

module.exports = app;
