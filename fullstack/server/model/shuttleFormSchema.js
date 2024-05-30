const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shuttleFormSchema = new Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    tripType: {
      type: String,
      enum: ["One-way", "Return", "Subscribe"],
      required: true,
    },
    bookingType: {
      type: String,
      required: function () {
        return this.tripType === "Subscribe";
      },
    },
    departureTime: {
      type: String,
      required: function () {
        return this.tripType === "Subscribe";
      },
    },
    selectDays: {
      type: [String],
      required: function () {
        return this.tripType === "Subscribe";
      },
    },
    durationInWeeks: {
      type: Number,
      required: function () {
        return this.tripType === "Subscribe";
      },
    },
  },
  { timestamps: true }
);

const ShuttleForm = mongoose.model("ShuttleForm", shuttleFormSchema);

module.exports = ShuttleForm;
