// Import required packages
const mongoose = require('mongoose');
require("dotenv").config();
const PORT = process.env.PORT || 4000;

const VendorTemplate = require('./model/Template');

// Sample data
const templates = [
    { theme_url: '/landing/image/preview/shop1.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop2.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop3.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop4.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop5.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop6.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop7.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop8.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop9.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop10.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop11.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop12.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop13.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop14.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop15.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop16.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop17.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop18.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop19.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop20.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop21.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop22.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop23.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop24.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop25.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop26.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop27.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop28.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop29.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop30.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop31.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop32.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop33.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop34.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop35.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop36.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop37.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop38.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop39.jpg', category_id: 1 },
    { theme_url: '/landing/image/preview/shop40.jpg', category_id: 1 },
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