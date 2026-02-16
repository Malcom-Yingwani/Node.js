const mongoose = require("mongoose");

const passportLocalMongoose = require("passport-local-mongoose").default;
const { Schema } = mongoose;
const Subscriber = require("./subscriber");
const randToken = require("rand-token");

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
    apiToken: {
      type: String,
    },
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

userSchema.pre("save", function () {
  let user = this;
  if (!user.apiToken) user.apiToken = randToken.generate(16);
});

module.exports = mongoose.model("User", userSchema);
