// Define the interfaces for the restaurant data
export interface CustomizationOption {
  name: string;
  price: string;
  default?: boolean;
}

export type OfferType = "buy_one_get_one" | "percent_off" | "free_item" | "fixed_price";

export interface Offer {
  offerType: OfferType;
  value?: string | number; // Percentage off, fixed price, etc.
  minOrderQuantity?: number; // Minimum quantity required for the offer
  minOrderValue?: string; // Minimum order value required for the offer
  freeItemId?: string; // ID of the free item for "free_item" offers
  expiryDate?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  popular?: boolean;
  vegetarian?: boolean;
  spicy?: boolean;
  customizationOptions?: {
    sizes?: {
      name: string;
      price: string;
    }[];
    ingredients?: CustomizationOption[];
    sauces?: CustomizationOption[];
  };
  offer?: Offer; // Offer attached directly to the menu item
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface PreviousOrderItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
  selectedOptions?: {
    size?: string;
    ingredients?: string[];
    sauces?: string[];
  };
}

export interface PreviousOrder {
  id: string;
  items: PreviousOrderItem[];
  date: string;
  total: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: string;
  distance: string;
  cuisine: string;
  description: string;
  address: string;
  openingHours: string;
  phoneNumber: string;
  website: string;
  latitude?: number;
  longitude?: number;
  previousOrders: PreviousOrder[];
  menuCategories: MenuCategory[];
}

// Restaurant data mapping
const restaurantsData: Record<string, Restaurant> = {
  'restaurant-1': {
    id: "restaurant-1",
    name: "Burger Palace",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
    coverImage: "https://images.unsplash.com/photo-1561758033-7e924f619b47?auto=format&fit=crop&w=1600&q=80",
    rating: 4.5,
    reviewCount: 423,
    deliveryTime: "20-30 min",
    deliveryFee: "$2.99",
    distance: "1.2 miles",
    cuisine: "American",
    description: "Gourmet burgers made with premium ingredients and served with our famous seasoned fries.",
    address: "123 Burger St, New York, NY 10001",
    openingHours: "11:00 AM - 10:00 PM",
    phoneNumber: "(212) 555-1234",
    website: "www.burgerpalace.com",
    latitude: 40.7128,
    longitude: -74.006,
    previousOrders: [],
    menuCategories: [
      {
        id: "burgers",
        name: "Burgers",
        items: [
          {
            id: "classic-burger",
            name: "Classic Burger",
            description: "Beef patty with lettuce, tomato, onion, and our special sauce",
            price: "$8.99",
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
            popular: true,
            customizationOptions: {
              ingredients: [
                { name: "Cheese", price: "$1.00" },
                { name: "Bacon", price: "$1.50" },
                { name: "Avocado", price: "$2.00" },
                { name: "Extra Patty", price: "$3.00" }
              ],
              sauces: [
                { name: "Special Sauce", price: "$0.00", default: true },
                { name: "BBQ Sauce", price: "$0.00" },
                { name: "Ranch", price: "$0.00" },
                { name: "Spicy Mayo", price: "$0.50" }
              ]
            },
            offer: {
              offerType: "buy_one_get_one",
              value: 50,
              expiryDate: "May 10, 2025"
            }
          },
          {
            id: "double-cheese",
            name: "Double Cheeseburger",
            description: "Two beef patties with double cheese, pickles, onions, and ketchup",
            price: "$11.99",
            image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80",
            popular: true,
            customizationOptions: {
              ingredients: [
                { name: "Bacon", price: "$1.50" },
                { name: "Avocado", price: "$2.00" },
                { name: "Jalapeños", price: "$0.75" },
                { name: "Fried Egg", price: "$1.50" }
              ]
            }
          },
          {
            id: "veggie-burger",
            name: "Veggie Burger",
            description: "Plant-based patty with lettuce, tomato, avocado, and vegan mayo",
            price: "$10.99",
            image: "https://images.unsplash.com/photo-1627587780063-1655815c958b?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=600&q=80",
            vegetarian: true,
            customizationOptions: {
              ingredients: [
                { name: "Vegan Cheese", price: "$1.50" },
                { name: "Grilled Mushrooms", price: "$1.00" },
                { name: "Caramelized Onions", price: "$0.75" }
              ],
              sauces: [
                { name: "Vegan Mayo", price: "$0.00", default: true },
                { name: "BBQ Sauce", price: "$0.00" },
                { name: "Sriracha", price: "$0.00" }
              ]
            },
            offer: {
              offerType: "percent_off",
              value: 15,
              expiryDate: "May 15, 2025"
            }
          }
        ]
      },
      {
        id: "sides",
        name: "Sides",
        items: [
          {
            id: "french-fries",
            name: "French Fries",
            description: "Crispy golden fries seasoned with our special blend of spices",
            price: "$3.99",
            image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=600&q=80",
            popular: true,
            vegetarian: true,
            customizationOptions: {
              sizes: [
                { name: "Regular", price: "$3.99" },
                { name: "Large", price: "$4.99" }
              ]
            },
            offer: {
              offerType: "free_item",
              minOrderValue: "$15",
              expiryDate: "May 20, 2025"
            }
          },
          {
            id: "onion-rings",
            name: "Onion Rings",
            description: "Crispy battered onion rings served with dipping sauce",
            price: "$4.99",
            image: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=600&q=80",
            vegetarian: true
          },
          {
            id: "milkshake",
            name: "Milkshake",
            description: "Creamy milkshake made with premium ice cream",
            price: "$5.99",
            image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
            vegetarian: true,
            customizationOptions: {
              sizes: [
                { name: "Regular", price: "$5.99" },
                { name: "Large", price: "$6.99" }
              ]
            }
          }
        ]
      }
    ]
  },
  'restaurant-3': {
    id: "restaurant-3",
    name: "Sushi Express",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80",
    coverImage: "https://images.unsplash.com/photo-1590987337605-84f3ed4dc29f?auto=format&fit=crop&w=1600&q=80",
    rating: 4.7,
    reviewCount: 512,
    deliveryTime: "25-35 min",
    deliveryFee: "$3.99",
    distance: "2.5 miles",
    cuisine: "Japanese",
    description: "Authentic Japanese sushi and sashimi prepared by master chefs using the freshest ingredients.",
    address: "456 Sushi Ave, New York, NY 10002",
    openingHours: "12:00 PM - 10:00 PM",
    phoneNumber: "(212) 555-5678",
    website: "www.sushiexpress.com",
    latitude: 40.7135,
    longitude: -74.0060,
    previousOrders: [],
    menuCategories: [
      {
        id: "rolls",
        name: "Signature Rolls",
        items: [
          {
            id: "california-roll",
            name: "California Roll",
            description: "Crab, avocado, and cucumber wrapped in seaweed and rice",
            price: "$7.99",
            image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",
            popular: true,
            customizationOptions: {
              sizes: [
                { name: "6 pieces", price: "$7.99" },
                { name: "12 pieces", price: "$14.99" }
              ]
            },
            offer: {
              offerType: "buy_one_get_one",
              value: 50,
              expiryDate: "May 10, 2025"
            }
          },
          {
            id: "spicy-tuna",
            name: "Spicy Tuna Roll",
            description: "Fresh tuna with spicy mayo and cucumber",
            price: "$9.99",
            image: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=600&q=80",
            popular: true,
            spicy: true,
            customizationOptions: {
              sizes: [
                { name: "6 pieces", price: "$9.99" },
                { name: "12 pieces", price: "$18.99" }
              ]
            }
          },
          {
            id: "dragon-roll",
            name: "Dragon Roll",
            description: "Eel and cucumber topped with avocado and eel sauce",
            price: "$12.99",
            image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=600&q=80",
            customizationOptions: {
              sizes: [
                { name: "8 pieces", price: "$12.99" }
              ]
            }
          }
        ]
      },
      {
        id: "sashimi",
        name: "Sashimi",
        items: [
          {
            id: "salmon-sashimi",
            name: "Salmon Sashimi",
            description: "Fresh slices of premium salmon",
            price: "$10.99",
            image: "https://images.unsplash.com/photo-1584799580661-53b7c6b99430?auto=format&fit=crop&w=600&q=80",
            popular: true,
            customizationOptions: {
              sizes: [
                { name: "5 pieces", price: "$10.99" },
                { name: "10 pieces", price: "$19.99" }
              ]
            }
          },
          {
            id: "tuna-sashimi",
            name: "Tuna Sashimi",
            description: "Fresh slices of premium tuna",
            price: "$12.99",
            image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",
            customizationOptions: {
              sizes: [
                { name: "5 pieces", price: "$12.99" },
                { name: "10 pieces", price: "$23.99" }
              ]
            }
          }
        ]
      }
    ]
  },
  'taco-fiesta': {
    id: "taco-fiesta",
    name: "Taco Fiesta",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
    coverImage: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=1600&q=80",
    rating: 4.3,
    reviewCount: 287,
    deliveryTime: "15-25 min",
    deliveryFee: "$1.99",
    distance: "0.8 miles",
    cuisine: "Mexican",
    description: "Authentic Mexican street tacos, burritos, and quesadillas made with traditional recipes.",
    address: "789 Taco Lane, Los Angeles, CA 90001",
    openingHours: "10:00 AM - 11:00 PM",
    phoneNumber: "(323) 555-7890",
    website: "www.tacofiesta.com",
    latitude: 34.0522,
    longitude: -118.2437,
    previousOrders: [],
    menuCategories: [
      {
        id: "signature-tacos",
        name: "Signature Tacos",
        items: [
          {
            id: "carne-asada-taco",
            name: "Carne Asada Taco",
            description: "Grilled marinated steak with cilantro, onions, and lime on a corn tortilla",
            price: "$4.99",
            image: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=600&q=80",
            popular: true,
            customizationOptions: {
              ingredients: [
                { name: "Extra Meat", price: "$1.50" },
                { name: "Guacamole", price: "$1.00" },
                { name: "Cheese", price: "$0.75" }
              ],
              sauces: [
                { name: "Salsa Verde", price: "$0.00", default: true },
                { name: "Hot Sauce", price: "$0.00" },
                { name: "Chipotle Sauce", price: "$0.50" }
              ]
            },
            offer: {
              offerType: "fixed_price",
              value: "$3.99",
              expiryDate: "May 5, 2025"
            }
          },
          {
            id: "al-pastor-taco",
            name: "Al Pastor Taco",
            description: "Marinated pork with pineapple, cilantro, and onions",
            price: "$4.49",
            image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80",
            popular: true,
            customizationOptions: {
              ingredients: [
                { name: "Extra Meat", price: "$1.50" },
                { name: "Guacamole", price: "$1.00" },
                { name: "Cheese", price: "$0.75" }
              ],
              sauces: [
                { name: "Salsa Roja", price: "$0.00", default: true },
                { name: "Hot Sauce", price: "$0.00" },
                { name: "Chipotle Sauce", price: "$0.50" }
              ]
            }
          },
          {
            id: "fish-taco",
            name: "Baja Fish Taco",
            description: "Crispy battered fish with cabbage slaw and lime crema",
            price: "$5.49",
            image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80",
            customizationOptions: {
              ingredients: [
                { name: "Extra Fish", price: "$2.00" },
                { name: "Avocado", price: "$1.00" }
              ],
              sauces: [
                { name: "Lime Crema", price: "$0.00", default: true },
                { name: "Chipotle Mayo", price: "$0.50" }
              ]
            }
          },
          {
            id: "veggie-taco",
            name: "Veggie Taco",
            description: "Grilled vegetables, black beans, and avocado with lime dressing",
            price: "$4.29",
            image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=600&q=80",
            vegetarian: true,
            customizationOptions: {
              ingredients: [
                { name: "Extra Veggies", price: "$1.00" },
                { name: "Guacamole", price: "$1.00" },
                { name: "Cheese", price: "$0.75" }
              ],
              sauces: [
                { name: "Lime Dressing", price: "$0.00", default: true },
                { name: "Salsa Verde", price: "$0.00" }
              ]
            }
          }
        ]
      },
      {
        id: "sides",
        name: "Sides & Extras",
        items: [
          {
            id: "chips-salsa",
            name: "Chips & Salsa",
            description: "Crispy tortilla chips with fresh homemade salsa",
            price: "$3.99",
            image: "https://images.unsplash.com/photo-1600335895229-6e75511892c8?auto=format&fit=crop&w=600&q=80",
            vegetarian: true,
            customizationOptions: {
              sizes: [
                { name: "Regular", price: "$3.99" },
                { name: "Large", price: "$5.99" }
              ],
              sauces: [
                { name: "Mild Salsa", price: "$0.00", default: true },
                { name: "Medium Salsa", price: "$0.00" },
                { name: "Hot Salsa", price: "$0.00" }
              ]
            }
          },
          {
            id: "guacamole",
            name: "Fresh Guacamole",
            description: "Freshly made guacamole with chips",
            price: "$5.99",
            image: "https://images.unsplash.com/photo-1600335895229-6e75511892c8?auto=format&fit=crop&w=600&q=80",
            vegetarian: true,
            customizationOptions: {
              sizes: [
                { name: "Regular", price: "$5.99" },
                { name: "Large", price: "$8.99" }
              ]
            }
          },
          {
            id: "mexican-rice",
            name: "Mexican Rice",
            description: "Traditional Mexican rice with tomatoes and spices",
            price: "$2.99",
            image: "https://images.unsplash.com/photo-1594221708779-94832f4320d1?auto=format&fit=crop&w=600&q=80",
            vegetarian: true,
            customizationOptions: {
              sizes: [
                { name: "Regular", price: "$2.99" },
                { name: "Large", price: "$4.99" }
              ]
            }
          }
        ]
      },
      {
        id: "french-tacos",
        name: "French Tacos",
        items: [
          {
            id: "classic-french-taco",
            name: "Classic French Taco",
            description: "Grilled tortilla filled with french fries, cheese sauce, choice of meat, and special sauce",
            price: "$8.99",
            image: "https://images.unsplash.com/photo-1628824851008-9e3016a2f55b?auto=format&fit=crop&w=600&q=80",
            popular: true,
            customizationOptions: {
              sizes: [
                { name: "Regular", price: "$0.00" },
                { name: "Large", price: "$2.00" },
                { name: "Extra Large", price: "$3.50" }
              ],
              ingredients: [
                { name: "Grilled Chicken", price: "$0.00", default: false },
                { name: "Ground Beef", price: "$0.00", default: false },
                { name: "Merguez Sausage", price: "$1.50", default: false },
                { name: "Shawarma Meat", price: "$1.50", default: false },
                { name: "Extra Cheese", price: "$1.00" },
                { name: "Extra Fries", price: "$1.00" }
              ],
              sauces: [
                { name: "Algerian Sauce", price: "$0.00", default: true },
                { name: "Harissa (Spicy)", price: "$0.00" },
                { name: "Mayonnaise", price: "$0.00" },
                { name: "Ketchup", price: "$0.00" },
                { name: "BBQ Sauce", price: "$0.00" }
              ]
            }
          },
          {
            id: "lyon-special-taco",
            name: "Lyon Special Taco",
            description: "French taco with beef, chicken, special Lyon sauce, raclette cheese and caramelized onions",
            price: "$11.99",
            image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=600&q=80",
            spicy: true,
            customizationOptions: {
              sizes: [
                { name: "Regular", price: "$11.99" },
                { name: "Large", price: "$13.99" },
                { name: "Extra Large", price: "$15.99" }
              ],
              ingredients: [
                { name: "Extra Meat", price: "$2.00" },
                { name: "Extra Cheese", price: "$1.00" },
                { name: "Extra Onions", price: "$0.50" }
              ],
              sauces: [
                { name: "Lyon Special Sauce", price: "$0.00", default: true },
                { name: "Harissa (Spicy)", price: "$0.00" }
              ]
            }
          },
          {
            id: "vegetarian-french-taco",
            name: "Vegetarian French Taco",
            description: "French taco with grilled vegetables, plant-based protein, french fries and cheese sauce",
            price: "$9.99",
            image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=600&q=80",
            vegetarian: true,
            customizationOptions: {
              sizes: [
                { name: "Regular", price: "$9.99" },
                { name: "Large", price: "$11.99" },
                { name: "Extra Large", price: "$13.99" }
              ],
              ingredients: [
                { name: "Falafel", price: "$1.50" },
                { name: "Grilled Halloumi", price: "$2.00" },
                { name: "Avocado", price: "$1.50" },
                { name: "Extra Vegetables", price: "$1.00" }
              ],
              sauces: [
                { name: "Yogurt Sauce", price: "$0.00", default: true },
                { name: "Spicy Harissa", price: "$0.00" },
                { name: "Tahini", price: "$0.00" },
                { name: "Garlic Sauce", price: "$0.00" }
              ]
            }
          }
        ]
      }
    ]
  },
  'pizza-paradise': {
    id: "pizza-paradise",
    name: "Pizza Paradise",
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=1200&q=80",
    coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=80",
    rating: 4.4,
    reviewCount: 356,
    deliveryTime: "20-35 min",
    deliveryFee: "$2.49",
    distance: "1.7 miles",
    cuisine: "Italian",
    description: "Authentic wood-fired pizzas made with imported Italian ingredients and traditional recipes.",
    address: "123 Pizza St, Chicago, IL 60601",
    openingHours: "11:00 AM - 11:00 PM",
    phoneNumber: "(312) 555-1234",
    website: "www.pizzaparadise.com",
    latitude: 41.8781,
    longitude: -87.6298,
    previousOrders: [],
    menuCategories: [
      {
        id: "pizzas",
        name: "Pizzas",
        items: [
          { id: "margherita-pizza", name: "Margherita Pizza", description: "Classic pizza with fresh mozzarella, basil, and tomato sauce", price: "$12.99", image: "https://images.unsplash.com/photo-1594007656598-eb3b3568afe2?auto=format&fit=crop&w=600&q=80", customizationOptions: { sizes: [{ name: "Medium", price: "$12.99" }, { name: "Large", price: "$14.99" }], sauces: [{ name: "Tomato Sauce", price: "$0.00", default: true }, { name: "Pesto Sauce", price: "$1.00" }] }, offer: {
              offerType: "percent_off",
              value: 30,
              minOrderValue: "$20",
              expiryDate: "May 12, 2025"
            } },
          { id: "pepperoni-pizza", name: "Pepperoni Pizza", description: "Spicy pepperoni with mozzarella and tomato sauce", price: "$14.99", image: "https://images.unsplash.com/photo-1565299584004-13a39364aa26?auto=format&fit=crop&w=600&q=80", popular: true, customizationOptions: { sizes: [{ name: "Medium", price: "$14.99" }, { name: "Large", price: "$16.99" }], sauces: [{ name: "Tomato Sauce", price: "$0.00", default: true }, { name: "BBQ Sauce", price: "$1.00" }] } }
        ]
      },
      {
        id: "sides",
        name: "Sides",
        items: [
          { id: "cheesy-bread", name: "Cheesy Bread", description: "Fresh baked bread topped with mozzarella and garlic butter", price: "$5.99", image: "https://images.unsplash.com/photo-1555419749-84aa1f4bf69e?auto=format&fit=crop&w=600&q=80" },
          { id: "garlic-knots", name: "Garlic Knots", description: "Soft dough knots tossed in garlic and herbs", price: "$4.99", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80" }
        ]
      },
      {
        id: "desserts",
        name: "Desserts",
        items: [
          { id: "chocolate-lava-cake", name: "Chocolate Lava Cake", description: "Warm chocolate cake with a gooey center", price: "$6.99", image: "https://images.unsplash.com/photo-1551024735-4a5de2324c2a?auto=format&fit=crop&w=600&q=80" },
          { id: "tiramisu", name: "Tiramisu", description: "Classic Italian dessert with mascarpone and espresso-soaked ladyfingers", price: "$7.99", image: "https://images.unsplash.com/photo-1588646951862-2b0253dc9303?auto=format&fit=crop&w=600&q=80" }
        ]
      }
    ]
  },
  'pasta-palace': {
    id: "pasta-palace",
    name: "Pasta Palace",
    image: "https://images.unsplash.com/photo-1528715471579-d3d4d6ba2886?auto=format&fit=crop&w=1200&q=80",
    coverImage: "https://images.unsplash.com/photo-1517248135467-3968b75cc699?auto=format&fit=crop&w=1600&q=80",
    rating: 4.6,
    reviewCount: 215,
    deliveryTime: "20-30 min",
    deliveryFee: "$2.99",
    distance: "1.9 miles",
    cuisine: "Italian",
    description: "Authentic Italian pasta dishes made with fresh, homemade pasta and traditional sauces.",
    address: "456 Pasta Ave, San Francisco, CA 94103",
    openingHours: "11:30 AM - 10:00 PM",
    phoneNumber: "(415) 555-7890",
    website: "www.pastapalace.com",
    latitude: 37.7749,
    longitude: -122.4194,
    previousOrders: [],
    menuCategories: [
      {
        id: "pasta-dishes",
        name: "Pasta Dishes",
        items: [
          { id: "spaghetti-bolognese", name: "Spaghetti Bolognese", description: "Rich meat sauce served over spaghetti", price: "$13.99", image: "https://images.unsplash.com/photo-1601312376763-0c5c4a2bcdc0?auto=format&fit=crop&w=600&q=80", customizationOptions: { sizes: [{ name: "Regular", price: "$13.99" }, { name: "Large", price: "$16.99" }] }, offer: {
              offerType: "buy_one_get_one",
              expiryDate: "May 18, 2025"
            } },
          { id: "fettuccine-alfredo", name: "Fettuccine Alfredo", description: "Creamy alfredo sauce tossed with fettuccine", price: "$12.99", image: "https://images.unsplash.com/photo-1551183053-bf91a1d811e9?auto=format&fit=crop&w=600&q=80", customizationOptions: { sizes: [{ name: "Regular", price: "$12.99" }, { name: "Large", price: "$15.99" }] } }
        ]
      },
      {
        id: "salads",
        name: "Salads",
        items: [
          { id: "caesar-salad", name: "Caesar Salad", description: "Romaine lettuce with Caesar dressing, croutons, and parmesan", price: "$8.99", image: "https://images.unsplash.com/photo-1551183053-bf91a1d811e9?auto=format&fit=crop&w=600&q=80" }
        ]
      },
      {
        id: "drinks",
        name: "Drinks",
        items: [
          { id: "sparkling-water", name: "Sparkling Water", description: "Refreshing carbonated water", price: "$2.99", image: "https://images.unsplash.com/photo-1559711068-f8dd00dc2f85?auto=format&fit=crop&w=600&q=80" }
        ]
      }
    ]
  }
};

export default restaurantsData;
