const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://anshulsharma6163_db_user:Z87V5XV5SRpOewO1@cluster0.3ll32bb.mongodb.net/aab-web?retryWrites=true&w=majority&appName=Cluster0';

async function run() {
    try {
        await mongoose.connect(MONGO_URI);
        const collections = await mongoose.connection.db.listCollections().toArray();
        for (const col of collections) {
            const schema = new mongoose.Schema({}, { strict: false });
            const Model = mongoose.models[col.name] || mongoose.model(col.name, schema, col.name);
            const docs = await Model.find({
                $or: [
                    { name: /Gift Card|Size guide|Care & Repair/i },
                    { title: /Gift Card|Size guide|Care & Repair/i },
                    { label: /Gift Card|Size guide|Care & Repair/i },
                    { question: /Gift Card|Size guide|Care & Repair/i },
                    { heading: /Gift Card|Size guide|Care & Repair/i },
                    { key: /Gift Card|Size guide|Care & Repair/i }
                ]
            });
            if (docs.length > 0) {
                console.log(`Found ${docs.length} matches in collection: ${col.name}`);
                docs.forEach(d => console.log(JSON.stringify(d, null, 2)));
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}
run();
