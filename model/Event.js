const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
     name: {
          type: String,
     },
     price: {
          type: String,
     },
     description: {
          type: String,
     },
     email: {
          type: String,
     },
     phoneNumber: {
          type: String,
     },
     noOfTicket: {
          type: String,
     },
     category: {
          type: String,
          enum: [
               "Music",
               "Nightlife",
               "Performing & Visual Arts",
               "Holidays",
               "Health",
               "Hobbies",
               "Business",
               "Food & Drink",
          ],
     },
     date: {
          type: Date,
     },
     country: {
          type: String,
     },
     city: {
          type: String,
     },
     address: {
          type: String,
     },

     coordinates: {
          lat: {
               type: Number,
               required: false,
          },
          lng: {
               type: Number,
               required: false,
          },
     },
     images: {
          type: Array,
     },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
