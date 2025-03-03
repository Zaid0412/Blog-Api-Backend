const { check } = require("express-validator");

const isReqMsg = "is required";
const lengthMsg = "should be between 5 and 35 characters";

module.exports.commentValidation = [
  check("username").exists().withMessage(`Name ${isReqMsg}`),
  check("comment").exists().withMessage(`Comment ${isReqMsg}`),
];
