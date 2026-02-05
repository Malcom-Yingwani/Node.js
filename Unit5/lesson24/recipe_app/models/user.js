const mongoose = require("mongoose");

const passportLocalMongoose = require("passport-local-mongoose").default;
const { Schema } = mongoose;
const Subscriber = require("./subscriber");
// const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    name: {
      first: {
        type: String,
        trim: true,
      },
      last: {
        type: String,
        trim: true,
      },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    zipCode: {
      type: Number,
      min: [10000, "Zip code too short"],
      max: 99999,
    },
    // password: {
    //   type: String,
    //   required: true,
    // },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    subscribedAccount: { type: Schema.Types.ObjectId, ref: "Subscriber" },
  },
  { timestamps: true },
);

userSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

// userSchema.pre("save", async function () {
//   let user = this;

//   try {
//     // Hash the user's password
//     const hash = await bcrypt.hash(user.password, 10);
//     user.password = hash;
//     // next();
//   } catch (error) {
//     console.log(`Error in hashing password: ${error.message}`);
//     next(error);
//   }
// });

// // Add a function to compare hashed passwords
// userSchema.methods.passwordComparison = function (inputPassword) {
//   let user = this;
//   return bcrypt.compare(inputPassword, user.password);
// };

userSchema.pre("save", async function () {
  let user = this;

  if (user.subscribedAccount === undefined) {
    try {
      const subscriber = await Subscriber.findOne({ email: user.email });
      user.subscribedAccount = subscriber;
      console.log("Pre-save hook ran successfully!");
    } catch (error) {
      console.log(`Error in connecting subscriber: ${error.message}`);
      next(error);
    }
  } else {
    console.log("User linked to subscriber...");
  }
});

module.exports = mongoose.model("User", userSchema);
