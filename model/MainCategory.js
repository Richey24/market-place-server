const mongoose = require('mongoose');

const MainCategorySchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
}, {
	timestamps: true,
});

const MainCategory = mongoose.model('MainCategory', MainCategorySchema);

module.exports = MainCategory;
