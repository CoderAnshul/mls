const mongoose = require('mongoose');
const Page = require('./models/Page');
const HomeAsset = require('./models/HomeAsset');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedContactData = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI not found in environment');
            process.exit(1);
        }
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Seed Contact Page
        const contactPage = {
            title: 'Contact Us',
            slug: 'contact-us',
            content: '<p>For any queries or feedback please complete the form below. We aim to respond to emails within 24 hours but at busy times this can take longer. If you require more urgent assistance or wish to place an order or speak to our customer care team directly you can call us on:</p>',
            metadata: {
                phone_uk: '+447 (0) 0203 823 7768',
                phone_whatsapp: '+44 (0) 203 823 7768',
                phone_int: '+447 (0) 0203 823 7768',
                email: 'admin@aabcollection.com',
                hours_note: '(Monday - Friday, 10am - 3pm)',
                response_note: 'We aim to respond to emails within 24 hours but at busy times this can take longer.',
                subjects: 'General Inquiry, Order Support, Returns, Wholesale'
            },
            isActive: true
        };

        await Page.findOneAndUpdate({ slug: 'contact-us' }, contactPage, { upsert: true, new: true });
        console.log('Contact Page seeded/updated');

        // 2. Seed Service Highlights
        const serviceHighlights = {
            key: 'service_highlights',
            type: 'object',
            value: [
                {
                    title: 'FAST DELIVERY',
                    description: 'Quick worldwide shipping on all orders',
                    icon: 'truck'
                },
                {
                    title: 'WHATSAPP SUPPORT',
                    description: 'Direct assistance via our WhatsApp protocol',
                    icon: 'message'
                },
                {
                    title: 'EASY RETURNS',
                    description: 'Easy paperless returns & free exchanges',
                    icon: 'rotate'
                }
            ],
            description: 'Highlights shown at the bottom of support pages'
        };

        await HomeAsset.findOneAndUpdate({ key: 'service_highlights' }, serviceHighlights, { upsert: true, new: true });
        console.log('Service Highlights seeded/updated');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedContactData();
