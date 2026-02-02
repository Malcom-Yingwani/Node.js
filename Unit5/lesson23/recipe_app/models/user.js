const mongoose = require("mongoose");
const Subscriber = require("./subscriber");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
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
    password: {
      type: String,
      required: true,
    },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    subscribedAccount: { type: Schema.Types.ObjectId, ref: "Subscriber" },
  },
  {
    timestamps: true,
  },
);

userSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});

userSchema.pre("save", async function (next) {
  let user = this;

  try {
    // Hash the user's password
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
  } catch (error) {
    console.log(`Error in hashing password: ${error.message}`);
    next(error);
  }
});

// Add a function to compare hashed passwords
userSchema.methods.passwordComparison = function (inputPassword) {
  let user = this;
  return bcrypt.compare(inputPassword, user.password);
};

userSchema.pre("save", async function () {
  try {
    if (this.subscribedAccount === undefined) {
      const subscriber = await Subscriber.findOne({ email: this.email });
      this.subscribedAccount = subscriber ?? null;
    }

    console.log("[User pre-save] ran");
  } catch (error) {
    console.error("[User pre-save] error:", error.message);
    throw error;
  }
});

module.exports = mongoose.model("User", userSchema);
