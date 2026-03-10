const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Navigation = require('./models/Navigation');
const Journal = require('./models/Journal');
const FAQ = require('./models/FAQ');
const HomeAsset = require('./models/HomeAsset');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => {
      console.log(err);
      process.exit(1);
  });

const seedData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany({});
    await Navigation.deleteMany({});
    await Journal.deleteMany({});
    await FAQ.deleteMany({});
    await Category.deleteMany({});
    await HomeAsset.deleteMany({});

    console.log('Cleared existing data...');

    // -1. Home Assets Data
    const homeAssets = [
      {
        key: 'hero_banner',
        type: 'image',
        value: 'https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?q=80&w=2670&auto=format&fit=crop',
        description: 'Main Hero Background'
      },
      {
        key: 'hero_text',
        type: 'text',
        value: 'RAMADAN COLLECTION 2024',
        description: 'Hero Overlay Text'
      },
      {
        key: 'hero_link',
        type: 'link',
        value: '/collections/ramadan',
        description: 'Hero Primary Action'
      },
      {
        key: 'feature_cards',
        type: 'object',
        value: [
          {
            title: 'VIEW LOOKBOOK',
            description: 'Discover how effortless modest fashion can be — browse for timeless styling inspirations.',
            image: 'https://images.unsplash.com/photo-1445205170230-053b830c6039?q=80&w=1000',
            link: '/lookbook'
          },
          {
            title: 'JOURNAL',
            description: 'Dive into our Journal for styling tips, modest fashion inspiration, and behind-the-scenes stories.',
            image: 'https://images.unsplash.com/photo-1512418490979-92798ccc1340?q=80&w=1000',
            link: '/journal'
          },
          {
            title: 'ABOUT US',
            description: 'Modesty at the core of every design',
            image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000',
            link: '/about-us'
          },
          {
            title: 'INTRODUCING BAKHOOR',
            description: 'A sensory journey that elevates your space and spirit',
            image: 'https://images.unsplash.com/photo-1603561591411-0e7336717f35?q=80&w=1000',
            link: '/collections/bakhoor'
          }
        ],
        description: 'Homepage Feature Cards'
      },
      {
        key: 'dual_banners',
        type: 'object',
        value: [
          {
            image: 'https://images.unsplash.com/photo-1574015974293-817f0efebb1b?q=80&w=1000',
            link: '/collections/selection-1'
          },
          {
            image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000',
            link: '/collections/selection-2'
          }
        ],
        description: 'Large Promo Banners'
      },
      {
        key: 'discover_more',
        type: 'object',
        value: [
          {
            image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2000',
            link: '/collections/collection-1'
          },
          {
            image: 'https://images.unsplash.com/photo-1445205170230-053b830c6039?q=80&w=2000',
            link: '/collections/collection-2'
          },
          {
            image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000',
            link: '/collections/collection-3'
          },
          {
            image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000',
            link: '/collections/collection-4'
          }
        ],
        description: 'Discover More Section'
      },
      {
        key: 'ramadan_essentials',
        type: 'object',
        value: [
          {
            title: 'PRAYER OUTFITS',
            image: 'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=1000',
            link: '/collections/prayer-outfits'
          },
          {
            title: 'OUTERWEAR',
            image: 'https://images.unsplash.com/photo-1515847049116-ea4c621115f6?q=80&w=1000',
            link: '/collections/outerwear'
          }
        ],
        description: 'Ramadan Section Nodes'
      },
      {
        key: 'shop_hijabs',
        type: 'object',
        value: [
          {
            title: 'Chiffon Silk',
            image: 'https://images.unsplash.com/photo-1549416878-b9ca95e26903?q=80&w=1000',
            link: '/collections/chiffon-silk'
          },
          {
            title: 'Modal',
            image: 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?q=80&w=1000',
            link: '/collections/modal'
          },
          {
            title: 'Crepe Chiffon',
            image: 'https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?q=80&w=1000',
            link: '/collections/crepe-chiffon'
          },
          {
            title: 'Jersey',
            image: 'https://images.unsplash.com/photo-1574015974293-817f0efebb1b?q=80&w=1000',
            link: '/collections/jersey'
          }
        ],
        description: 'Homepage Shop Hijab Cluster'
      },
      {
        key: 'signature_embroideries',
        type: 'object',
        value: [
          {
            image: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2000',
            title: 'Refined Artistry',
            link: '/collections/embroidered'
          },
          {
            image: 'https://images.unsplash.com/photo-1512418490979-92798ccc1340?q=80&w=2000',
            title: 'Timeless Elegance',
            link: '/collections/classic'
          }
        ],
        description: 'Signature Embroideries Slider'
      }
    ];
    await HomeAsset.insertMany(homeAssets);
    console.log('Home Assets seeded');

    // 0. Categories Data
    const categoryData = [
      { name: 'ABAYAS', slug: 'abayas' },
      { name: 'KAFTANS', slug: 'kaftans' },
      { name: 'MAXI DRESSES', slug: 'maxi-dresses' },
      { name: 'TROUSERS & SKIRTS', slug: 'trousers-skirts' }
    ];
    await Category.insertMany(categoryData);
    console.log('Categories seeded');

    // 1. Navigation Data
    const navItems = [
      {
        title: 'RAMADAN COLLECTION',
        href: '/collections/ramadan',
        order: 1,
        features: [
          {
            title: 'Elegant styles for the holy month.',
            image: 'https://images.unsplash.com/photo-1549416878-b9ca95e26903?q=80&w=800',
            link: '/collections/ramadan'
          }
        ],
        sections: [
          {
            heading: 'Collections',
            links: [
                { label: 'View All', href: '/collections/ramadan' },
                { label: 'Drop 1', href: '/collections/ramadan-drop-1' },
                { label: 'Drop 2', href: '/collections/ramadan-drop-2' },
                { label: 'Prayer Outfits', href: '/collections/prayer-outfits' },
                { label: 'Gift Sets', href: '/collections/gift-sets' }
            ]
          }
        ]
      },
      {
        title: 'CLOTHING',
        href: '/collections/clothing',
        order: 2,
        features: [
          {
            title: 'Discover the latest trends.',
            image: 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?q=80&w=800',
            link: '/collections/clothing'
          }
        ],
        sections: [
          {
            heading: 'Shop By Category',
            links: [
                { label: 'All Clothing', href: '/collections/clothing' },
                { label: 'Abayas', href: '/collections/abayas' },
                { label: 'Kaftans', href: '/collections/kaftans' },
                { label: 'Dresses', href: '/collections/dresses' },
                { label: 'Trousers', href: '/collections/trousers' }
            ]
          },
           {
            heading: 'Featured',
            links: [
                { label: 'New Arrivals', href: '/collections/new-arrivals' },
                { label: 'Best Sellers', href: '/collections/best-sellers' }
            ]
          }
        ]
      },
       {
        title: 'HIJABS',
        href: '/collections/hijabs',
        order: 3,
        features: [
          {
            title: 'Soft, breathable fabrics.',
            image: 'https://images.unsplash.com/photo-1585257588339-e932ec79f323?q=80&w=800',
            link: '/collections/hijabs'
          }
        ],
        sections: [
             {
            heading: 'Materials',
            links: [
                { label: 'Chiffon', href: '/collections/chiffon-hijabs' },
                { label: 'Jersey', href: '/collections/jersey-hijabs' },
                { label: 'Silk', href: '/collections/silk-hijabs' }
            ]
          }
        ]
      },
      { 
        title: 'MENS', 
        href: '/collections/mens', 
        order: 4,
        features: [
          {
            title: 'Mens Thobes',
            image: 'https://images.unsplash.com/photo-1610652492500-ded49ceeb378?q=80&w=600',
            link: '/collections/thobes'
          },
          {
            title: 'Boys Thobes',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600',
            link: '/collections/boys'
          }
        ],
        sections: [
          {
            heading: 'MENS COLLECTION',
            links: [
              { label: 'VIEW ALL', href: '/collections/mens' },
              { label: 'BOYS THOBES', href: '/collections/boys' },
              { label: 'MENS THOBES', href: '/collections/thobes' },
            ]
          }
        ]
      },
      { title: 'OUTLET', href: '/collections/outlet', order: 5 },
      { title: 'JOURNAL', href: '/journal', order: 6 },
      { title: 'LOOKBOOK', href: '/lookbook', order: 7 }
    ];

    await Navigation.insertMany(navItems);
    console.log('Navigation seeded');

    // 2. Product Data
    const products = [
        {
          title: 'CHANINI ABAYA BLACK',
          price: 169.00,
          images: ['https://images.unsplash.com/photo-1549416878-b9ca95e26903?q=80&w=800'],
          category: 'ABAYAS',
          isNew: true,
          description: 'A classic black abaya suitable for all occasions.'
        },
        {
          title: 'FAYRUZ KAFTAN',
          price: 120.00,
          images: ['https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?q=80&w=800'],
          category: 'KAFTANS',
          isNew: true,
          description: 'Elegant kaftan with intricate details.'
        },
        {
          title: 'JOURI ABAYA',
          price: 165.00,
          images: ['https://images.unsplash.com/photo-1581413816003-88ec0c5a3964?q=80&w=800'],
          category: 'ABAYAS',
          isNew: true
        },
        {
          title: 'SILK SLIP DRESS',
          price: 95.00,
          images: ['https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=800'],
          category: 'SLIP DRESSES'
        },
        {
          title: 'EMBROIDERED KIMONO',
          price: 145.00,
          images: ['https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=800'],
          category: 'KIMONOS'
        },
        {
          title: 'LINEN TROUSERS',
          price: 75.00,
          images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800'],
          category: 'TROUSERS & SKIRTS'
        },
        {
          title: 'MAXI DRESS BLUE',
          price: 180.00,
          images: ['https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?q=80&w=800'],
          category: 'MAXI DRESSES'
        }
    ];

    await Product.insertMany(products);
    console.log('Products seeded');

    // 3. Journal Data
    const journals = [
        {
            title: 'An Ode to Her: Celebrating the Light, Beauty, and Strength of Women This Ramadan',
            slug: 'ode-to-her',
            date: new Date('2024-04-09'),
            heroImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop',
            excerpt: 'This Ramadan, we honor the women who embody the essence of this sacred month.',
            content: {
                blocks: [
                    { type: 'text', content: 'From their hands flow traditions, from their voices rise prayers...' },
                    { type: 'image', src: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=2940&auto=format&fit=crop' }
                ]
            }
        }
    ];
    await Journal.insertMany(journals);
    console.log('Journals seeded');

    // 4. FAQ Data
    const faqs = [
        { question: 'What fits do you offer?', answer: 'We offer Regular, Petite, and Tall fits.' },
        { question: 'How do I care for my abaya?', answer: 'We recommend dry cleaning or hand washing in cold water.' }
    ];
    await FAQ.insertMany(faqs);
    console.log('FAQs seeded');

    console.log('Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
