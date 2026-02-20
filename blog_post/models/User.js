const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator").default;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please provide username"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
  },
});

UserSchema.plugin(uniqueValidator);

UserSchema.pre("save", async function () {
  const user = this;
  try {
    user.password = await bcrypt.hash(user.password, 10);
  } catch (error) {
    console.log(error);
  }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
