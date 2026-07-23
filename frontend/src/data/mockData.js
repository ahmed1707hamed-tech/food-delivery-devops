import {
  cuisines,
  restaurantPrefixes,
  restaurantSuffixes,
  mealNames,
  foodImages,
  logos,
  adjectiveDescriptions,
} from './catalog';

const rnd = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const pick = (arr, seed) => arr[Math.floor(rnd(seed) * arr.length)];

const menuCategories = ['Starter', 'Main Course', 'Signature', 'Sides', 'Dessert', 'Drinks'];

const buildRestaurant = (id) => {
  const cuisine = pick(cuisines, id * 3.17);
  const deliveryTime = 18 + Math.floor(rnd(id * 7.11) * 30);
  const deliveryFee = Number((rnd(id * 8.91) * 4.8).toFixed(2));
  const rating = Number((3.8 + rnd(id * 2.4) * 1.2).toFixed(1));
  const priceLevel = 1 + Math.floor(rnd(id * 4.5) * 3);
  const offers = pick(['20% OFF', 'Free Delivery', 'Buy 1 Get 1', 'No Offer'], id * 9.2);

  const name = `${pick(restaurantPrefixes, id * 1.7)} ${pick(restaurantSuffixes, id * 2.1)}`;

  return {
    id: 1000 + id,
    name,
    category: cuisine,
    cuisine,
    rating,
    image_url: pick(foodImages, id * 4.8),
    cover_image: pick(foodImages, id * 5.8),
    logo: pick(logos, id * 6.4),
    delivery_time: `${deliveryTime}-${deliveryTime + 10} min`,
    delivery_fee: deliveryFee,
    description: pick(adjectiveDescriptions, id * 10.2),
    price_level: priceLevel,
    offers,
    popular_meals: mealNames[cuisine].slice(0, 3),
  };
};

const buildMenuItem = (restaurantId, itemIndex, cuisine) => {
  const seed = restaurantId * 31 + itemIndex;
  const baseNames = mealNames[cuisine] || mealNames.Pizza;
  const baseName = baseNames[itemIndex % baseNames.length];

  return {
    id: restaurantId * 100 + itemIndex + 1,
    restaurant_id: restaurantId,
    name: `${baseName} ${itemIndex + 1}`,
    description: 'Freshly prepared with balanced seasoning and premium ingredients.',
    image_url: pick(foodImages, seed * 1.9),
    category: menuCategories[itemIndex % menuCategories.length],
    price: Number((5 + rnd(seed * 2.4) * 28).toFixed(2)),
    rating: Number((3.9 + rnd(seed * 3.2) * 1.1).toFixed(1)),
    calories: 220 + Math.floor(rnd(seed * 5.6) * 650),
  };
};

export const generatedRestaurants = Array.from({ length: 56 }, (_, index) => buildRestaurant(index + 1));

export const generatedMenusByRestaurant = generatedRestaurants.reduce((acc, restaurant, idx) => {
  const count = 15 + (idx % 11);
  acc[restaurant.id] = Array.from({ length: count }, (_, itemIndex) =>
    buildMenuItem(restaurant.id, itemIndex, restaurant.cuisine),
  );
  return acc;
}, {});

const statuses = ['Pending', 'Preparing', 'On The Way', 'Delivered', 'Cancelled'];

export const generatedOrders = Array.from({ length: 24 }, (_, i) => {
  const restaurant = generatedRestaurants[i % generatedRestaurants.length];
  const menu = generatedMenusByRestaurant[restaurant.id];
  const items = menu.slice(0, 2 + (i % 3)).map((item, idx) => {
    const quantity = 1 + ((i + idx) % 3);
    return {
      id: i * 100 + idx + 1,
      quantity,
      price: item.price,
      menu_item: item,
    };
  });
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderDate = new Date(Date.now() - i * 86400000);

  return {
    id: 9000 + i,
    restaurant_id: restaurant.id,
    restaurant_name: restaurant.name,
    status: statuses[i % statuses.length],
    created_at: orderDate.toISOString(),
    estimated_delivery: new Date(orderDate.getTime() + 45 * 60000).toISOString(),
    order_number: `FD-${9000 + i}`,
    payment_method: i % 2 === 0 ? 'Visa **** 4831' : 'Cash on delivery',
    delivery_address: '221B Nile Corniche, Cairo',
    total_price: Number(totalPrice.toFixed(2)),
    items,
  };
});

export const defaultUserProfile = {
  name: 'Ahmed Hamed',
  email: 'ahmed.hamed@example.com',
  phone: '+20 10 2345 9876',
  address: 'Nasr City, Cairo',
  avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=320&q=80',
  savedAddresses: [
    { id: 1, label: 'Home', address: 'Nasr City, Cairo, Egypt' },
    { id: 2, label: 'Office', address: 'Smart Village, Giza, Egypt' },
  ],
  paymentMethods: [
    { id: 1, type: 'Visa', masked: '**** 4831', expiry: '03/29' },
    { id: 2, type: 'Mastercard', masked: '**** 8150', expiry: '11/28' },
  ],
};
