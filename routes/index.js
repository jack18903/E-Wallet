const express = require('express')
const router = express.Router()
var cookieParser = require('cookie-parser')
router.use(cookieParser())

//model
const Users = require('../models/user')

//auth

const jwt = require('jsonwebtoken');
const user = require('../models/user')
const { default: mongoose } = require('mongoose')
const { find } = require('../models/user')
var secret = 'secretpasstoken'

const DBPATH = 'mongodb://localhost:27017/vidientu'
mongoose.connect(DBPATH);


//hàm check đăng nhập
function isLoggined(req, res, next) {
    try {
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        Users.findOne({
            _id: decodeToken
        }).then(data => {
            if (data) {
                req.data = data
                if (data.countlogin === '0') {
                    return res.render('firstLogin', { username: data.username })
                }
                else if (data.countlogin === '1') {
                    return res.render('index', { username: data.username, fullname: data.fullname })
                }

                next()
            }
        }).catch(err => {
            console.log(err)
        })
    } catch (error) {
        return res.redirect('/auth/login')
    }
}


router.get('/', isLoggined, (req, res) => {
    res.render('index', {
        username: username
    });
})




module.exports = router
