import psycopg2
from passlib.context import CryptContext
import random
from datetime import datetime, timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Random Data Sources
CUISINES = ["Pizza", "Burger", "Chicken", "Seafood", "Desserts", "Drinks", "Coffee", "Pasta", "Healthy", "Asian", "Mexican", "Italian", "Japanese", "Arabic", "Indian"]
RESTAURANT_PREFIXES = ["The Great", "Mama's", "Spicy", "Golden", "Royal", "Urban", "Fresh", "Happy", "Crispy", "Green"]
RESTAURANT_SUFFIXES = ["Kitchen", "Grill", "Bistro", "Diner", "Cafe", "House", "Place", "Express", "Oven", "Bowl"]

MEAL_NAMES = {
    "Pizza": ["Margherita", "Pepperoni", "BBQ Chicken", "Vegetarian", "Hawaiian", "Meat Lovers", "Four Cheese"],
    "Burger": ["Classic Cheeseburger", "Double Bacon", "Mushroom Swiss", "Spicy Jalapeno", "Veggie Burger", "BBQ Smash", "Chicken Sandwich"],
    "Chicken": ["Fried Chicken Bucket", "Grilled Wings", "Chicken Tenders", "Spicy Wrap", "Roast Chicken", "Chicken Nuggets", "Chicken Salad"],
    "Seafood": ["Fish and Chips", "Grilled Salmon", "Shrimp Scampi", "Calamari", "Lobster Roll", "Crab Cakes", "Seafood Paella"],
    "Desserts": ["Chocolate Cake", "Cheesecake", "Ice Cream Sundae", "Brownie", "Apple Pie", "Tiramisu", "Donuts"],
    "Drinks": ["Cola", "Lemonade", "Iced Tea", "Orange Juice", "Milkshake", "Sparkling Water", "Smoothie"],
    "Coffee": ["Espresso", "Cappuccino", "Latte", "Americano", "Mocha", "Macchiato", "Cold Brew"],
    "Pasta": ["Spaghetti Bolognese", "Fettuccine Alfredo", "Penne Arrabbiata", "Mac & Cheese", "Lasagna", "Pesto Pasta", "Carbonara"],
    "Healthy": ["Quinoa Salad", "Avocado Toast", "Green Bowl", "Acai Bowl", "Grilled Chicken Salad", "Fruit Plate", "Veggie Wrap"],
    "Asian": ["Pad Thai", "Fried Rice", "Spring Rolls", "Dim Sum", "Sweet & Sour Pork", "Kung Pao Chicken", "Pho"],
    "Mexican": ["Tacos", "Burrito", "Quesadilla", "Nachos", "Enchiladas", "Fajitas", "Guacamole & Chips"],
    "Italian": ["Risotto", "Caprese Salad", "Bruschetta", "Osso Buco", "Minestrone", "Ravioli", "Gnocchi"],
    "Japanese": ["Sushi Roll", "Sashimi", "Ramen", "Udon", "Tempura", "Teriyaki Chicken", "Miso Soup"],
    "Arabic": ["Shawarma", "Falafel", "Hummus", "Kebab", "Mandi", "Tabbouleh", "Moutabal"],
    "Indian": ["Chicken Tikka Masala", "Biryani", "Butter Chicken", "Naan", "Samosa", "Palak Paneer", "Dal Makhani"]
}

# Unsplash image IDs for foods (broadly mapped)
FOOD_IMAGES = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
]

def seed_db():
    conn = psycopg2.connect(
        user="postgres",
        password="postgres",
        host="localhost",
        port="5432",
        database="food_delivery"
    )
    cursor = conn.cursor()
    
    print("Clearing database...")
    cursor.execute("TRUNCATE TABLE order_items, orders, menu_items, restaurants, users RESTART IDENTITY CASCADE;")
    
    print("Seeding Users...")
    hashed_admin = pwd_context.hash("admin123")
    cursor.execute(
        "INSERT INTO users (name, email, hashed_password, address, phone, is_admin) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
        ("Admin", "admin@example.com", hashed_admin, "Admin HQ", "1234567890", True)
    )
    
    hashed_user = pwd_context.hash("user123")
    cursor.execute(
        "INSERT INTO users (name, email, hashed_password, address, phone, is_admin) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
        ("Jane Doe", "user@example.com", hashed_user, "456 Elm St, Cityville", "0987654321", False)
    )
    user_id = cursor.fetchone()[0]

    print("Seeding Restaurants (50+)...")
    restaurants = []
    for i in range(1, 55):
        cuisine = random.choice(CUISINES)
        name = f"{random.choice(RESTAURANT_PREFIXES)} {cuisine} {random.choice(RESTAURANT_SUFFIXES)}"
        desc = f"The best {cuisine.lower()} food in town. Authentic and delicious."
        rating = round(random.uniform(3.5, 5.0), 1)
        cover_image = random.choice(FOOD_IMAGES)
        # Assuming delivery_time and fee are part of description or we can use them in frontend randomly if not in DB.
        # Wait, the DB schema for Restaurant only has name, desc, category, rating, image_url.
        # I will store delivery time and fee in the frontend or just encode it in description.
        # Actually, let's just stick to the schema: id, name, description, category, rating, image_url
        restaurants.append((name, desc, cuisine, rating, cover_image))

    cursor.executemany(
        "INSERT INTO restaurants (name, description, category, rating, image_url) VALUES (%s, %s, %s, %s, %s) RETURNING id",
        restaurants
    )
    
    cursor.execute("SELECT id, category FROM restaurants")
    db_restaurants = cursor.fetchall()
    
    print("Seeding Menu Items (15-25 per restaurant)...")
    menu_items = []
    for r_id, r_cat in db_restaurants:
        num_items = random.randint(15, 25)
        for _ in range(num_items):
            # Prefer items from the restaurant's category, but mix in some generic drinks/desserts
            item_cat = random.choice([r_cat, r_cat, r_cat, "Drinks", "Desserts", "Healthy"])
            item_name = f"{random.choice(['Spicy', 'Classic', 'Special', 'Premium', 'Chefs'])} {random.choice(MEAL_NAMES.get(item_cat, MEAL_NAMES['Burger']))}"
            item_desc = f"Delicious {item_name.lower()} prepared with fresh ingredients."
            price = round(random.uniform(5.0, 35.0), 2)
            img = random.choice(FOOD_IMAGES)
            menu_items.append((r_id, item_name, item_desc, price, item_cat, img))
            
    cursor.executemany(
        "INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url) VALUES (%s, %s, %s, %s, %s, %s)",
        menu_items
    )
    
    print("Seeding Orders (20+)...")
    cursor.execute("SELECT id, price FROM menu_items")
    all_menu_items = cursor.fetchall()
    
    statuses = ["Delivered", "Delivered", "Delivered", "On The Way", "Preparing", "Pending", "Cancelled"]
    orders = []
    order_items = []
    
    for i in range(25):
        status = random.choice(statuses)
        # 1 to 5 items per order
        num_items = random.randint(1, 5)
        order_total = 0
        items_for_this_order = []
        for _ in range(num_items):
            m_item = random.choice(all_menu_items)
            qty = random.randint(1, 3)
            order_total += m_item[1] * qty
            items_for_this_order.append((m_item[0], qty, m_item[1]))
            
        # created_at logic (past dates)
        days_ago = random.randint(0, 30)
        created_at = datetime.now() - timedelta(days=days_ago, hours=random.randint(1, 24))
        
        cursor.execute(
            "INSERT INTO orders (user_id, status, total_price, created_at) VALUES (%s, %s, %s, %s) RETURNING id",
            (user_id, status, order_total, created_at)
        )
        order_id = cursor.fetchone()[0]
        
        for m_id, qty, price in items_for_this_order:
            order_items.append((order_id, m_id, qty, price))
            
    cursor.executemany(
        "INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (%s, %s, %s, %s)",
        order_items
    )

    conn.commit()
    cursor.close()
    conn.close()
    print("Database seeded successfully with massive realistic data!")

if __name__ == "__main__":
    seed_db()
