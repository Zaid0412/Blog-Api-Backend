const { check } = require("express-validator");

const isReqMsg = "is required";
const lengthMsg = "should be between 5 and 35 characters";

module.exports.registerValidation = [
  check("username")
    .exists()
    .withMessage(`Username ${isReqMsg}`)
    .isLength({ min: 5, max: 35 })
    .withMessage(`Username ${lengthMsg}`),
  check("email")
    .exists()
    .withMessage(`Email ${isReqMsg}`)
    .isEmail()
    .withMessage(`Email is not valid`),

  check("password")
    .exists()
    .withMessage(`Password ${isReqMsg}`)
    .isLength({ min: 5, max: 35 })
    .withMessage(`Password ${lengthMsg}`),
  check("confirm_password")
    .custom((value, { req }) => {
      if (req.body.conf_password !== req.body.password) {
        console.log(req.body.conf_password);
        console.log(req.body.password);
        throw new Error("Password did not match");
      }
      return true;
    })
    .withMessage("Passwords did not match."),
];

module.exports.commentValidation = [
  check("username").exists().withMessage(`Name ${isReqMsg}`),
  check("comment").exists().withMessage(`Comment ${isReqMsg}`),
];
