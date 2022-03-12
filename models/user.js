const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//Schema
const userSchema = new mongoose.Schema({
  username: {
    type: "string",
    required: [true, "Username cannot be blank", true],
  },
  password: {
    type: "string",
    required: [true, "Password cannot be blank", true],
  },
});

//User validation function on login
userSchema.statics.findAndValidate = async function (username, password) {
  const foundUser = await this.findOne({ username });
  if (!foundUser) {
    return false;
  }
  const isValid = await bcrypt.compare(password, foundUser.password);
  return isValid ? foundUser : false;
};

//Pre save function to has password
userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});


module.exports = mongoose.model("User", userSchema);
