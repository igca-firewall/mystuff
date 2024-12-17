import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaShoppingCart, FaCartPlus } from "react-icons/fa"; // Removed heart icons
import { useRouter } from "next/navigation";

const FeaturedProducts = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<number[]>([]); // Cart functionality
  const [purchasePopup, setPurchasePopup] = useState<boolean>(false); // Purchase Popup
  const [showPurchaseModal, setShowPurchaseModal] = useState<boolean>(false); // Purchase modal
  const router = useRouter();

  const tickets = [
    { title: "Standard", price: "$1", image: "/images/ticket gray white.png", description: "For beginners." },
    { title: "Emerald", price: "$2", image: "/images/ticket green white.png", description: "Moderate level." },
    { title: "Sapphire", price: "$8", image: "/images/ticket blue white.png", description: "Premium tier." },
    { title: "Rose Gold", price: "$10", image: "/images/ticket pink white.png", description: "Luxury level." },
    { title: "Ruby", price: "$15", image: "/images/ticket red white.png", description: "High stakes." },
    { title: "Amethyst", price: "$25", image: "/images/ticket purple white.png", description: "Ultimate experience." },
  ];

  const handleCardSelection = (card: number) => {
    setSelectedCard(card);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const addToCart = (card: number) => {
    // Check if the item is already in the cart
    if (!cartItems.includes(card)) {
      setCartItems((prevItems) => [...prevItems, card]);
      setPurchasePopup(true);
      setTimeout(() => setPurchasePopup(false), 1500);
    } else {
      // Item already in cart popup
      alert(`Item "${tickets[card].title}" is already in the cart!`);
    }
  };
  
  const togglePurchaseModal = () =>
    setShowPurchaseModal((prevState) => !prevState); // Open/close purchase modal

  return (
    <section className="py-24 bg-gray-50 text-center">
      <motion.h2
        className="text-5xl font-semibold text-gray-800"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        Featured Products
      </motion.h2>

      <div className="flex flex-wrap justify-center gap-8 mt-12">
        {tickets.map((ticket, index) => (
          <motion.div
            key={index}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all w-80 text-center cursor-pointer transform hover:scale-105"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.2, duration: 0.8 }}
            onClick={() => handleCardSelection(index)}
          >
            <Image
              src={ticket.image} // Updated image paths
              alt={ticket.title}
              width={200}
              height={200}
              className="mx-auto p-0 rounded-lg"
              loading="lazy"
            />
            <h3 className="text-2xl font-bold mt-4 text-gray-800">
              {`${ticket.title} Ticket`}            </h3>
            <p className="text-gray-600 mt-2">{ticket.description}</p>
            <p className="text-gray-800 mt-2 text-xl font-semibold">{ticket.price}</p>

            <div className="mt-4 flex justify-center items-center">
              <button
                className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(index);
                }}
              >
                <FaCartPlus className="text-xl" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedCard !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <motion.div
            className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-3xl font-semibold mb-4 text-gray-800">
              {`Purchase ${tickets[selectedCard].title} Ticket`}
            </h3>
            <p className="text-gray-600 mb-4">
              {tickets[selectedCard].description}
            </p>
            <p className="text-gray-800 mb-6 text-2xl font-semibold">
              {tickets[selectedCard].price}
            </p>

            <div className="flex justify-between">
              <button
                className="bg-orange-500 text-white py-3 px-8 rounded-full hover:bg-orange-600 transition-all"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                className="bg-green-500 text-white py-3 px-8 rounded-full hover:bg-green-600 transition-all"
                onClick={() => router.push("/checkout")}
              >
                Proceed to Purchase
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Purchase Popup */}
      {purchasePopup && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg">
          Added to Cart
        </div>
      )}

      {/* Cart Counter */}
      <div className="fixed bottom-8 right-8 bg-orange-500 text-white rounded-full px-6 py-2 shadow-lg cursor-pointer">
        <FaShoppingCart className="text-xl" />
        <span className="ml-2">{cartItems.length}</span>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <motion.div
            className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-3xl font-semibold mb-4 text-gray-800">
              Confirm Your Purchase
            </h3>
            {cartItems.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              <ul className="space-y-4">
                {cartItems.map((item, index) => (
                  <li key={index} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <span className="text-lg font-semibold text-gray-800">
                        {`${tickets[item].title} Ticket`}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">{tickets[item].price}</span>
                    </div>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all"
                      onClick={() =>
                        setCartItems(cartItems.filter((i) => i !== item))
                      }
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-500 text-white py-3 px-8 rounded-full hover:bg-gray-600 transition-all"
                onClick={togglePurchaseModal}
              >
                Close
              </button>
              <button
                className="bg-green-500 text-white py-3 px-8 rounded-full hover:bg-green-600 transition-all"
                onClick={() => alert("Purchase Confirmed")}
              >
                Confirm Purchase
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Cart Modal */}
      {cartItems.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <motion.div
            className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg transform transition-all"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-3xl font-semibold mb-4 text-gray-800">
              Your Cart ({cartItems.length} Items)
            </h3>

            <ul className="space-y-4">
              {cartItems.map((item, index) => (
                <li key={index} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-all">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={tickets[item].image} // Updated with ticket image
                      alt={tickets[item].title}
                      width={50}
                      height={50}
                      className="rounded-lg"
                    />
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {tickets[item].title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {tickets[item].price}
                      </p>
                    </div>
                  </div>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all"
                    onClick={() => setCartItems(cartItems.filter((i) => i !== item))}
                  >
                    x
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-500 text-white py-3 px-8 rounded-full hover:bg-gray-600 transition-all"
                onClick={togglePurchaseModal} // If you have logic to toggle the purchase modal
              >
                Proceed to Checkout
              </button>
              <button
                className="bg-orange-500 text-white py-3 px-8 rounded-full hover:bg-orange-600 transition-all"
                onClick={togglePurchaseModal} // Toggle cart modal off when done
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;
