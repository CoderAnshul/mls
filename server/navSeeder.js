const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Navigation = require('./models/Navigation');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for Navigation Seeding'))
  .catch(err => {
      console.error('Connection error:', err);
      process.exit(1);
  });

const navigationData = [
  {
    title: 'RAMADAN COLLECTION',
    href: '/collections/ramadan',
    order: 1,
    sections: [
      {
        heading: 'RAMADAN COLLECTION',
        links: [
          { label: 'VIEW ALL', href: '/collections/ramadan' },
          { label: 'DROP 1', href: '/collections/ramadan-drop-1' },
          { label: 'DROP 2', href: '/collections/ramadan-drop-2' },
          { label: 'DROP 3', href: '/collections/ramadan-drop-3' }
        ]
      },
      {
        heading: 'ALL NEW IN',
        links: [
          { label: 'ABAYAS', href: '/collections/abayas' },
          { label: 'EMBROIDERIES', href: '/collections/embroideries' },
          { label: 'MAXI DRESSES', href: '/collections/maxi-dresses' },
          { label: 'HIJABS', href: '/collections/hijabs' },
          { label: 'KIMONOS', href: '/collections/kimonos' },
          { label: 'PRAYER OUTFITS', href: '/collections/prayer-outfits' },
          { label: 'SLIP DRESSES', href: '/collections/slip-dresses' }
        ]
      }
    ],
    features: [
      {
        title: 'Embroideries',
        image: 'https://images.unsplash.com/photo-1549416878-b9ca95e26903?q=80&w=800',
        link: '/collections/embroideries'
      },
      {
        title: 'New Arrivals',
        image: 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?q=80&w=800',
        link: '/collections/new-arrivals'
      }
    ]
  },
  {
    title: 'CLOTHING',
    href: '/collections/clothing',
    order: 2,
    sections: [
      {
        heading: 'ALL CLOTHING',
        links: [
          { label: 'ABAYAS', href: '/collections/abayas' },
          { label: 'EMBROIDERIES', href: '/collections/embroideries' },
          { label: 'PRAYER OUTFITS', href: '/collections/prayer-outfits' },
          { label: 'MAXI DRESSES', href: '/collections/maxi-dresses' },
          { label: 'KIMONOS', href: '/collections/kimonos' },
          { label: 'KAFTANS', href: '/collections/kaftans' },
          { label: 'SECOND SKIN', href: '/collections/second-skin' },
          { label: 'SLIP DRESSES', href: '/collections/slip-dresses' },
          { label: 'CO-ORD SETS', href: '/collections/co-ord-sets' },
          { label: 'COATS & COVER UPS', href: '/collections/coats-cover-ups' },
          { label: 'MIDIS & TOPS', href: '/collections/midis-tops' },
          { label: 'SHIRT DRESSES', href: '/collections/shirt-dresses' }
        ]
      },
      {
        heading: 'WHAT TO WEAR',
        links: [
          { label: 'IFTAR GATHERINGS', href: '/collections/iftar-gatherings' },
          { label: 'TARAWIH NIGHTS', href: '/collections/tarawih-nights' },
          { label: 'HAJJ & UMRAH', href: '/collections/hajj-umrah' },
          { label: 'AAB HERITAGE COLLECTION', href: '/collections/heritage' },
          { label: 'VACATION', href: '/collections/vacation' }
        ]
      }
    ],
    features: [
      {
        title: 'Two Piece Abaya Sets',
        image: 'https://images.unsplash.com/photo-1581413816003-88ec0c5a3964?q=80&w=800',
        link: '/collections/two-piece-sets'
      },
      {
        title: 'Hajj & Umrah',
        image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=800',
        link: '/collections/hajj-umrah'
      }
    ]
  },
  {
    title: 'HIJABS',
    href: '/collections/hijabs',
    order: 3,
    sections: [
      {
        heading: 'HIJAB COLLECTION',
        links: [
          { label: 'VIEW ALL', href: '/collections/hijabs' },
          { label: 'CHIFFON SILK HIJABS', href: '/collections/chiffon-silk' },
          { label: 'PREMIUM JERSEY HIJABS', href: '/collections/premium-jersey' },
          { label: 'PREMIUM MODAL HIJABS', href: '/collections/premium-modal' },
          { label: 'PRINT HIJABS', href: '/collections/print-hijabs' },
          { label: 'TIE BACK HIJABS', href: '/collections/tie-back-hijabs' },
          { label: 'ESSENTIAL MODAL HIJABS', href: '/collections/essential-modal' },
          { label: 'ESSENTIAL JERSEY HIJABS', href: '/collections/essential-jersey' },
          { label: 'CREPE CHIFFON HIJABS', href: '/collections/crepe-chiffon' },
          { label: 'CREPE HIJABS', href: '/collections/crepe-hijabs' },
          { label: 'WOOL MODAL HIJABS', href: '/collections/wool-modal' },
          { label: 'BLACK HIJABS', href: '/collections/black-hijabs' }
        ]
      },
      {
        heading: 'ESSENTIAL HIJABS',
        links: [
          { label: 'ESSENTIAL MODAL HIJABS', href: '/collections/essential-modal' },
          { label: 'ESSENTIAL JERSEY HIJABS', href: '/collections/essential-jersey' },
          { label: 'CREPE CHIFFON HIJABS', href: '/collections/crepe-chiffon' }
        ]
      },
      {
        heading: 'HIJAB ACCESSORIES',
        links: [
          { label: 'HIJAB CAPS', href: '/collections/hijab-caps' },
          { label: 'HIJAB MAGNETS', href: '/collections/hijab-magnets' },
          { label: 'SCRUNCHIES', href: '/collections/scrunchies' },
          { label: 'SWIM CAPS', href: '/collections/swim-caps' },
          { label: 'FACE MASKS', href: '/collections/face-masks' }
        ]
      }
    ],
    features: [
      {
        title: 'New In Hijabs',
        image: 'https://images.unsplash.com/photo-1585257588339-e932ec79f323?q=80&w=800',
        link: '/collections/new-in-hijabs'
      },
      {
        title: 'Hijab Magnets',
        image: 'https://images.unsplash.com/photo-1603561591411-0e7336717f35?q=80&w=800',
        link: '/collections/hijab-magnets'
      }
    ]
  },
  {
    title: 'MENS',
    href: '/collections/mens',
    order: 4,
    sections: [
      {
        heading: 'MENS',
        links: [
          { label: 'VIEW ALL', href: '/collections/mens' },
          { label: 'BOYS THOBES', href: '/collections/boys-thobes' },
          { label: 'MENS THOBES', href: '/collections/mens-thobes' }
        ]
      }
    ],
    features: [
      {
        title: 'Mens Thobes',
        image: 'https://images.unsplash.com/photo-1610652492500-ded49ceeb378?q=80&w=600',
        link: '/collections/mens-thobes'
      },
      {
        title: 'Boys Thobes',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600',
        link: '/collections/boys-thobes'
      }
    ]
  },
  {
    title: 'OUTLET',
    href: '/collections/outlet',
    order: 5,
    sections: [
      {
        heading: 'VIEW ALL OUTLET',
        links: [
          { label: 'ABAYA SALE', href: '/collections/abaya-sale' },
          { label: 'MAXI DRESSES SALE', href: '/collections/maxi-dresses-sale' },
          { label: 'KIMONOS SALE', href: '/collections/kimonos-sale' },
          { label: 'KAFTANS SALE', href: '/collections/kaftans-sale' },
          { label: 'COATS & COVER-UPS SALE', href: '/collections/coats-cover-ups-sale' },
          { label: 'CO-ORDS SALE', href: '/collections/co-ords-sale' },
          { label: 'HIJABS SALE', href: '/collections/hijabs-sale' },
          { label: 'MIDIS & TOPS SALE', href: '/collections/midis-tops-sale' },
          { label: 'TROUSERS & SKIRTS SALE', href: '/collections/trousers-skirts-sale' },
          { label: 'SLIP DRESSES SALE', href: '/collections/slip-dresses-sale' },
          { label: 'SWIMWEAR SALE', href: '/collections/swimwear-sale' }
        ]
      },
      {
        heading: 'SHOP OUTLET BY SIZE',
        links: [
          { label: 'XXS (UK 4-6)', href: '/collections/outlet?size=xxs' },
          { label: 'XS (UK 6-8)', href: '/collections/outlet?size=xs' },
          { label: 'S (UK 10-12)', href: '/collections/outlet?size=s' },
          { label: 'M (UK 14-16)', href: '/collections/outlet?size=m' },
          { label: 'L (UK 18-20)', href: '/collections/outlet?size=l' },
          { label: 'XL (UK 22-24)', href: '/collections/outlet?size=xl' },
          { label: 'XXL (UK 24-26)', href: '/collections/outlet?size=xxl' }
        ]
      },
      {
        heading: 'SHOP OUTLET BY PRICE',
        links: [
          { label: 'ABAYAS UNDER £45', href: '/collections/outlet?price_max=45&category=abayas' },
          { label: 'MAXI DRESSES UNDER £45', href: '/collections/outlet?price_max=45&category=maxi-dresses' },
          { label: 'CO-ORDS UNDER £45', href: '/collections/outlet?price_max=45&category=co-ords' }
        ]
      }
    ],
    features: [
      {
        title: 'Trending on Sale',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800',
        link: '/collections/outlet?sort=trending'
      },
      {
        title: 'Final Sale',
        image: 'https://images.unsplash.com/photo-1445205170230-053b830c6039?q=80&w=800',
        link: '/collections/outlet?sort=final-sale'
      }
    ]
  },
  {
    title: 'JOURNAL',
    href: '/journal',
    order: 6,
    sections: [],
    features: []
  },
  {
    title: 'LOOKBOOK',
    href: '/lookbook',
    order: 7,
    sections: [],
    features: []
  }
];

const seedNavigation = async () => {
    try {
        await Navigation.deleteMany({});
        console.log('Cleared existing navigation data');
        
        await Navigation.insertMany(navigationData);
        console.log('Navigation seeded successfully');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding navigation:', error);
        process.exit(1);
    }
};

seedNavigation();
