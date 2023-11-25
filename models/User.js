const mongoose = require("mongoose");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    passwordChangeAt: Date,
    passwordResettoken: String,
    passwordExpire: Date,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.methods.resetpasswordtoken = function () {
  const reset_token = crypto.randomBytes(32);
  this.passwordResettoken = crypto
    .createHash("sha256")
    .update(reset_token)
    .digest("hex");
  this.passwordExpire = Date.now() + 10 * 60 * 1000;

  return reset_token;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
