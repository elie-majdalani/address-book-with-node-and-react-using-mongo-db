const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
    fullname: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    relationship: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  //geoJSON object
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  });
  
  const Address = mongoose.model("Address", AddressSchema);

module.exports = Address;