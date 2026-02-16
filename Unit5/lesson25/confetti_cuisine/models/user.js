const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Subscriber = require("./subscriber");
const passportLocalMongoose = require("passport-local-mongoose");

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
      unique: true,
    },
    zipCode: {
      type: Number,
      min: [10000, "Zip code too short"],
      max: 99999,
    },

    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    subscribedAccount: {
      type: Schema.Types.ObjectId,
      ref: "Subscriber",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});

userSchema.pre("save", async function (next) {
  try {
    if (this.subscribedAccount === undefined) {
      const subscriber = await Subscriber.findOne({
        email: this.email,
      });

      this.subscribedAccount = subscriber;
    }
  } catch (error) {
    console.log(`Error in connecting subscriber: ${error.message}`);
  }
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

module.exports = mongoose.model("User", userSchema);
