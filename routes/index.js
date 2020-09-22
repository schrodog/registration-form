const express = require('express');
const router = express.Router();
const Recaptcha = require('express-recaptcha').RecaptchaV2;
const fs = require('fs')
const path = require("path")

const SITE_KEY = '6LdWec0ZAAAAALjWLhtcmAiNe6GeH7m9Q0bcyGW0'
const SECRET_KEY = '6LdWec0ZAAAAADRZsUiS-ezpO8WMbuueb42sTbFm'

// const recaptcha = new Recaptcha(SITE_KEY, SECRET_KEY, {callback: 'cb'})
let recaptcha = new Recaptcha(SITE_KEY, SECRET_KEY)

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });


router.get("/", recaptcha.middleware.render, (req, res, next) => {
  let code = req.query.valid 
  let errMsg = ''
  if(code === 'cap'){
    errMsg = "Please validate recaptcha"
  } else if (code === 'false'){
    errMsg = "Incorrect input"
  }
  res.render("inquiry", {captcha: res.recaptcha, message: errMsg})
})

router.get("/success", (req, res) => {
  res.render("success")
})

router.post("/submit", recaptcha.middleware.verify, (req, res) => {

  let valid = validate(req.body)
  if (!valid){
    res.redirect("/?valid=false")
    return
  }
  if(req.recaptcha.error){
    res.redirect('/?valid=cap')
    return
  }
  
  saveToFile(req.body)
  res.render("success")
})

const validateEmail = email => {
  const exp = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/i
  return exp.test(String(email).toLowerCase())
}


const validate = data => {
  const {fullname, email, subscribe } = data

  if (fullname == '' || email == '' || (subscribe !== 'yes' && subscribe !== 'no') ){
    console.error('invalid input')
    return false
  }
  if (!validateEmail(email)){
    return false
  }
  return true
}

const saveToFile = data => {
  let {fullname, email, message, subscribe } = data

  message = message.replace('"', '""')
  let str = `\n"${fullname}","${email}","${message}","${subscribe}","${new Date().getTime()}"`

  const paths = path.resolve(__dirname,"..", "data", "result.csv")

  fs.appendFileSync(paths, str, err => {
    if(err) return console.error(err)
  })
}



module.exports = router;
