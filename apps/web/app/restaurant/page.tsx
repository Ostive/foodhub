import Image from "next/image";

export default function RestaurantPage() {
  return (
    <main className="min-h-svh flex flex-col items-center justify-start bg-gradient-to-br from-[#fff7ed] via-[#fff3e0] to-[#fff7ed]">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center py-16 px-4">
        <Image
          src="https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=800&q=80"
          alt="Restaurant dashboard"
          width={320}
          height={200}
          className="rounded-3xl shadow-xl mb-8 object-cover w-full max-w-xl h-56"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">Grow Your Restaurant</h1>
        <p className="text-lg md:text-xl text-[#a45b00] text-center max-w-2xl mb-6">
          Welcome to FoodYou's restaurant partner portal. Manage your menu, orders, and reach more customers with ease.
        </p>
        <a href="#features" className="inline-block bg-[#FF9800] text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-[#e65100] transition">See Features</a>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full max-w-5xl py-12 px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Partner with FoodYou?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-8">
            <Image src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=400&q=80" alt="Menu Management" width={100} height={100} className="rounded-xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Menu Management</h3>
            <p className="text-gray-600 text-center">Easily update your menu and showcase your best dishes.</p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-8">
            <Image src="https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80" alt="Order Dashboard" width={100} height={100} className="rounded-xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Order Dashboard</h3>
            <p className="text-gray-600 text-center">Track and manage incoming orders in real time.</p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-8">
            <Image src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80" alt="Grow Your Reach" width={100} height={100} className="rounded-xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Grow Your Reach</h3>
            <p className="text-gray-600 text-center">Attract new customers and boost your restaurant’s visibility.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full flex flex-col items-center py-12">
        <a href="/restaurant-dashboard/signup" className="bg-[#FF9800] text-white px-10 py-4 rounded-full font-bold shadow hover:bg-[#e65100] transition text-lg">Join Now</a>
      </section>
    </main>
  );
}
