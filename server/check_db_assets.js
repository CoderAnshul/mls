
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://anshulsharma6163_db_user:Z87V5XV5SRpOewO1@cluster0.3ll32bb.mongodb.net/aab-web?retryWrites=true&w=majority&appName=Cluster0';

async function checkDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');
        const HomeAsset = mongoose.model('HomeAsset', new mongoose.Schema({
            key: String,
            value: mongoose.Schema.Types.Mixed
        }));

        const assets = await HomeAsset.find({ key: { $in: ['dual_banners', 'discover_more'] } });
        console.log('--- DB ASSETS ---');
        assets.forEach(a => {
            console.log(`Key: ${a.key}`);
            console.log(`Value: ${JSON.stringify(a.value, null, 2)}`);
            console.log('---');
        });
        await mongoose.disconnect();
    } catch (err) {
        console.error('DB Error:', err.message);
    }
}

checkDB();
