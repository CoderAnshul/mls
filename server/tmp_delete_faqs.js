const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://anshulsharma6163_db_user:Z87V5XV5SRpOewO1@cluster0.3ll32bb.mongodb.net/aab-web?retryWrites=true&w=majority&appName=Cluster0';

async function run() {
    try {
        await mongoose.connect(MONGO_URI);
        const FAQ = mongoose.model('FAQ', new mongoose.Schema({ question: String }));
        const res = await FAQ.deleteMany({ 
            question: { $in: ['What fits do you offer?', 'How do I care for my abaya?'] } 
        });
        console.log('Deleted documents:', res.deletedCount);
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}
run();
