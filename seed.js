// Import required packages
const mongoose = require('mongoose');
require("dotenv").config();
const PORT = process.env.PORT || 4000;

const VendorTemplate = require('./model/Template');

// Sample data
const templates = [
    { theme_url: '/landing/img/previews/shop1.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop2.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop3.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop4.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop5.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop6.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop7.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop8.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop9.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop10.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop11.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop12.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop13.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop14.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop15.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop16.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop17.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop18.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop19.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop20.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop21.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop22.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop23.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop24.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop25.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop26.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop27.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop28.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop29.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop30.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop31.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop32.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop33.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop34.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop35.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop36.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop37.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop38.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop39.jpg', category_id: 1 },
    { theme_url: '/landing/img/previews/shop40.jpg', category_id: 1 },
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