const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
  {
   /*  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }, */
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

formSchema.index({ email: 1 }, { unique: true });
formSchema.index({ phoneNumber: 1 }, { unique: true });

const Userdb = mongoose.model("Userdb", formSchema);
module.exports = Userdb;
