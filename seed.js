// Import required packages
const mongoose = require('mongoose');
require("dotenv").config();
const PORT = process.env.PORT || 4000;

const VendorTemplate = require('./model/Template');

// Sample data
const templates = [
    { theme_url: '/landing/img/preview/shop1.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop2.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop3.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop4.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop5.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop6.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop7.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop8.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop9.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop10.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop11.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop12.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop13.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop14.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop15.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop16.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop17.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop18.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop19.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop20.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop21.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop22.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop23.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop24.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop25.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop26.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop27.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop28.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop29.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop30.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop31.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop32.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop33.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop34.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop35.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop36.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop37.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop38.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop39.jpg', category_id: 1 },
    { theme_url: '/landing/img/preview/shop40.jpg', category_id: 1 },
];

async function seedDatabase() {
    // Connect to the MongoDB server
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to the database...');

    try {
        // Insert the sample data into the User collection
        await VendorTemplate.insertMany(templates);
        console.log('Template Seeder inserted successfully.');

    } catch (err) {
        console.error('Error:', err);

    } finally {
        // Close the database connection
        mongoose.connection.close();
        console.log('Database connection closed.');
    }
}

// Invoke the seeder function
seedDatabase();