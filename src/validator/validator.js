const mongoose = require('mongoose')  

//=========================// isValidEmail //===================================

const isValidEmail = function (value) {
  let emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;
  if (emailRegex.test(value)) return true;
};

//============================// idCharacterValid //============================

const isIdValid = function (value) {
  return mongoose.Types.ObjectId.isValid(value); 
};

//==========================// isValidString //==================================

const isValidString = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

//==============================// isValidName //===============================

const isValidName = function (name) {
  if (/^[a-zA-Z ]+$/.test(name)) {
    return true;
  }
};

//==============================// isValidMobile //===============================

const isValidMobile = function (mobile) {
 if (/^[0]?[789]\d{9}$/.test(mobile)){
    return true
 }
}

//==============================// isValidImage //===============================

const isValidImage = function (image) {
    if (/^(https\:\/\/.*\.(?:png|jpg|jpeg))/.test(image)){
       return true
    }
   }

//==============================// isValidPassword //==============================

const isValidPassword = function (pw) {
    let pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/;
    if (pass.test(pw)) return true;
  };

//==============================// isValidISBN //==============================

const isValidISBN = function (pw) {
  let pass = /^[\d*\-]{10,13}$/;
  if (pass.test(pw)) return true;
};

//=============================// module exports //================================

module.exports = {isValidISBN ,isValidPassword, isValidEmail, isIdValid, isValidString,isValidName,isValidMobile,isValidImage}