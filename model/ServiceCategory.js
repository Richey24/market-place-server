const mongoose = require('mongoose');

const serviceFirstCat = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
});

const serviceSecondCat = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    firstCat: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
});

const serviceThirdCat = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    secondCat: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true,
});

const ServiceFirstCat = mongoose.model('ServiceFirstCat', serviceFirstCat);
const ServiceSecondCat = mongoose.model('ServiceSecondCat', serviceSecondCat);
const ServiceThirdCat = mongoose.model('ServiceThirdCat', serviceThirdCat);

module.exports = { ServiceFirstCat, ServiceSecondCat, ServiceThirdCat };
