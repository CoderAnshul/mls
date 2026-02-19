const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://anshulsharma6163_db_user:Z87V5XV5SRpOewO1@cluster0.3ll32bb.mongodb.net/aab-web?retryWrites=true&w=majority&appName=Cluster0';

const editorContentSchema = new mongoose.Schema(
  {
    time: Number,
    blocks: [
      {
        type: { type: String, required: true },
        data: { type: mongoose.Schema.Types.Mixed, required: true },
      },
    ],
    version: String,
  },
  { _id: false }
);

const journalSchema = new mongoose.Schema({
  title: String,
  slug: String,
  date: Date,
  heroImage: String,
  excerpt: String,
  content: editorContentSchema,
  isPublished: Boolean,
}, { timestamps: true });

const Journal = mongoose.model('Journal', journalSchema);

async function fixImageBlocks() {
  await mongoose.connect(MONGO_URI);

  const journals = await Journal.find({});
  for (const journal of journals) {
    let changed = false;
    if (journal.content && Array.isArray(journal.content.blocks)) {
      for (const block of journal.content.blocks) {
        if (
          block.type === 'image' &&
          (!block.data || !block.data.file || !block.data.file.url)
        ) {
          // Fix: set block.data to a valid structure
          block.data = {
            file: { url: '' },
            caption: '',
            withBorder: false,
            withBackground: false,
            stretched: false,
          };
          changed = true;
        }
      }
      if (changed) {
        await journal.save();
        console.log(`Fixed journal: ${journal.slug}`);
      }
    }
  }
  mongoose.disconnect();
}

fixImageBlocks();
