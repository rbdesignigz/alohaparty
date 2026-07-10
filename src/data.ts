import { Product, Order, User } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Topper Sirena Mágica',
    category: 'Cake Toppers',
    price: 15.00,
    description: 'Capas de cartulina perlada y detalles en foil dorado. Perfecto para tartas mágicas y cumpleaños de ensueño.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80',
    stock: 45,
    isRecent: true,
    isPopular: true
  },
  {
    id: '2',
    name: 'Mini Piñata Dino Pastel',
    category: 'Piñatas Mini',
    price: 22.50,
    description: 'Ideal como centro de mesa o dulcero. Hecho a mano con papel crepé premium y detalles en relieve. Incluye compuerta secreta para relleno.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
    stock: 12,
    isRecent: true,
    isPopular: false
  },
  {
    id: '3',
    name: 'Set Invitaciones Botánicas',
    category: 'Tarjetas Personalizadas',
    price: 18.00,
    description: 'Pack de 10 invitaciones impresas en papel de algodón de 300g. Incluye sobres elegantes de color verde oliva.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    stock: 25,
    isRecent: false,
    isPopular: true
  },
  {
    id: '4',
    name: 'Guirnalda Estelar',
    category: 'Banderines y Guirnaldas',
    price: 12.00,
    description: '2 metros de largo. Troquelados en cartulina texturizada con hilo de lino premium en tonos pastel y estrellas con brillo.',
    image: 'https://images.unsplash.com/photo-1507504038482-76210f6ec33d?w=600&auto=format&fit=crop&q=80',
    stock: 30,
    isRecent: true,
    isPopular: false
  },
  {
    id: '5',
    name: "Cajitas Dulceras 'Bosque'",
    category: 'Cajitas Dulceras',
    price: 9.50,
    description: 'Set de 6 unidades listas para armar. Diseños adorables de zorritos, conejos y ositos de bosque. Ideal para cumpleaños temáticos.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApu8rqwR1tUJlSFhYbWmxTFECaJMwAd_LpuH41bVsi_hjbIHUifxdI1v1Xq7tG3zxZpJmXqJfze7EHdPluIQiIHwqyOTjjSc1WMD327oN1tyANZHzaQ713kQDaSnNnd9thaiekeugV5hVKnCCynOkbJHcT8MqVJ9caB-YCrjgGUn4l22sADLEx2rfjBqz6LFZqg4qP_HsnqL1frViWddnbINUmQA3DLRPjXXHCgVR7Ny2SftPWrWMJ',
    stock: 15,
    isRecent: false,
    isPopular: true
  },
  {
    id: '6',
    name: 'Banderín Personalizado "Tropical"',
    category: 'Banderines y Guirnaldas',
    price: 15.00,
    description: 'Banderines personalizados con el nombre troquelado y decoraciones de hojas tropicales de cartulina. Variante: Rosado / Verde.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPBRJPizF6ZupBUQaGSjnf-RYwdABlTj6vpEZV_5xCTSukUgJpPUBDjntanIEoUDq42Bsd9tnIz9SmQ8ymrzpWpIrR09e5JO1uXkyp4xLw47aMBfnOsgVgKhKnRyT9IBmzr-txQnpRfcsdjt4C2iwElXfL1RdaVH-ViUdTl2WhLAxTfVifgxlnln5-9uyK94MP3Cs8hSSNTj5ibNKN4xnMPQ37oI0Uc_2EFsJ_JcuxtFqQp2E_WBsE',
    stock: 20,
    isRecent: true,
    isPopular: true
  },
  {
    id: '7',
    name: 'Cajitas Dulceras (Pack 10)',
    category: 'Cajitas Dulceras',
    price: 24.00,
    description: 'Hermoso set de 10 cajitas para dulces o recuerdos. Diseño Aloha Boho con flores secas troqueladas y cintas de raso premium.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApu8rqwR1tUJlSFhYbWmxTFECaJMwAd_LpuH41bVsi_hjbIHUifxdI1v1Xq7tG3zxZpJmXqJfze7EHdPluIQiIHwqyOTjjSc1WMD327oN1tyANZHzaQ713kQDaSnNnd9thaiekeugV5hVKnCCynOkbJHcT8MqVJ9caB-YCrjgGUn4l22sADLEx2rfjBqz6LFZqg4qP_HsnqL1frViWddnbINUmQA3DLRPjXXHCgVR7Ny2SftPWrWMJ',
    stock: 18,
    isRecent: false,
    isPopular: false
  },
  {
    id: '8',
    name: 'Pastel Dream Notebook',
    category: 'Notebooks',
    price: 12.50,
    description: 'Cuaderno artesanal con costura expuesta. Tapas duras forradas en tela texturizada color rosa pastel con detalles grabados en oro.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCF_zAXqjtzJ-NeQNujY8eVw3rUNVrosjF0xG10XP84EKcgfymJw1qKpBmxQq62mw-pzIum5aW4uEGxgWUn5F2FJ3Ob22uEyw9Ia4Rnezr8uB-GvOlI1vMUtVe_f6WpoXFlRwDESmqJSBreXAImMyJHlcsQo3ERsTGlYxf7uQJFDcSXcJJJ9U2eB70rqQM6OqqqUQ--Uinaf62mo_qEP9lS_Qo1pyWDstpK0PuMvmyss0OkzZmdxsD0',
    stock: 45,
    isRecent: false,
    isPopular: true
  },
  {
    id: '9',
    name: 'Floral Washi Tape Set',
    category: 'Washi Tape',
    price: 8.00,
    description: 'Set de 3 cintas adhesivas de papel de arroz decorativas con ilustraciones florales en acuarela y detalles metálicos dorados.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJsnexkhwhmfuhR-JnC7Fxq8zSXQ1ogdPli0xs3Syo6LhiN6UJFxXctsNLixFw0Pinj2prJnDW7uMPu96MLxcTuiScuDODqk979o8TsHXtWD5sZ_jiLD-wkVs2Ru8tWIZYJLGQ-IEucLN63Dg_Sk3qAomBUYhph4I2Hm4hZhBLsglxIgGMGOeyjDGqjB1pESMK_QsVrhNr6k1FME0tiMY1zFSDHpXYsTZf84-3VGF0xRfHs6SaGzM6',
    stock: 12,
    isRecent: true,
    isPopular: true
  },
  {
    id: '10',
    name: 'Minimalist Shape Stickers',
    category: 'Stickers',
    price: 4.50,
    description: 'Plancha troquelada de stickers geométricos en tonos terracota, oliva y mostaza. Acabado mate sedoso para scrapbooking y decoración.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3diyJcwuVZfRYgcZ8yE3TZoW2cjCiRDuA56Qoef_ThKeA4wld_8zbENUVhZbbXd5CbGo9AvDL6Jh59jf2bw-75RvPzWP0jDNGP8CmsH7eaB9gO9hqdOwOoEocaLWxSWU76VUiHEk111vauMUykJWitDVEu7NJur-6VyCus82bXBossmC2Dyg1yVLBlpDZiJ34qeD0rLw3-he2Vtn4Ejkc2rYKK4MIQd9_czfKMcyp29mzsdOB6YuS',
    stock: 105,
    isRecent: false,
    isPopular: false
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8941',
    customerName: 'María Pérez',
    email: 'maria@email.com',
    address: 'Av. Providencia 1254, Depto 402',
    city: 'Santiago',
    region: 'Región Metropolitana',
    items: [
      {
        product: INITIAL_PRODUCTS[5], // Banderín Personalizado "Tropical"
        quantity: 1
      },
      {
        product: INITIAL_PRODUCTS[6], // Cajitas Dulceras (Pack 10)
        quantity: 2
      }
    ],
    total: 67.50, // 15 + 24*2 = 63 + 4.5 shipping
    date: '2026-07-09T14:32:00Z',
    status: 'pending'
  },
  {
    id: 'ORD-7624',
    customerName: 'Juan Rodríguez',
    email: 'juan@email.com',
    address: 'Calle Valparaíso 450',
    city: 'Viña del Mar',
    region: 'Valparaíso',
    items: [
      {
        product: INITIAL_PRODUCTS[0], // Topper Sirena Mágica
        quantity: 2
      },
      {
        product: INITIAL_PRODUCTS[2], // Set Invitaciones Botánicas
        quantity: 1
      }
    ],
    total: 52.50, // 15*2 + 18 = 48 + 4.5 shipping
    date: '2026-07-08T09:15:00Z',
    status: 'shipped'
  },
  {
    id: 'ORD-4512',
    customerName: 'Carolina Fuentes',
    email: 'caro@email.com',
    address: 'O\'Higgins 824',
    city: 'Concepción',
    region: 'Biobío',
    items: [
      {
        product: INITIAL_PRODUCTS[7], // Pastel Dream Notebook
        quantity: 1
      },
      {
        product: INITIAL_PRODUCTS[8], // Floral Washi Tape Set
        quantity: 3
      }
    ],
    total: 41.00, // 12.5 + 8*3 = 36.5 + 4.5 shipping
    date: '2026-07-05T18:40:00Z',
    status: 'delivered'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Aloha Admin',
    email: 'admin@alohaparty.cl',
    role: 'admin'
  },
  {
    id: 'usr-1',
    name: 'María Pérez',
    email: 'maria@email.com',
    role: 'customer'
  },
  {
    id: 'usr-2',
    name: 'Juan Rodríguez',
    email: 'juan@email.com',
    role: 'customer'
  },
  {
    id: 'usr-3',
    name: 'Carolina Fuentes',
    email: 'caro@email.com',
    role: 'customer'
  }
];
