const mongoose = require('mongoose');

const downloadStat = mongoose.Schema({
    os: {
        type: String,
    },
    browser: {
        type: String,
    },
}, {
    timestamps: true,
});

const DownloadStat = mongoose.model('DownloadStat', downloadStat)

module.exports = { DownloadStat }