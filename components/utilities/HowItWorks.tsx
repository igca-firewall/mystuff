import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const HowItWorks = () => {
  const [ref, inView] = useInView({
    triggerOnce: false, // Re-trigger animations when re-entering the viewport
    threshold: 0.2, // Trigger when 20% of the element is visible
  });

  const controls = useAnimation();

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [inView, controls]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <section
        className="py-24 px-6 bg-white text-center"
        ref={ref} // Attach the Intersection Observer
      >
        {/* Title */}
        <motion.h2
          className="text-5xl font-semibold text-gray-800"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          transition={{ delay: 0.3, duration: 1 }}
        >
          How It Works
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-lg text-gray-600 mt-6 mb-12 max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Purchase a ticket, unlock your prize, and enjoy instant rewards. It’s
          that easy. Explore a marketplace of professional-grade products.
        </motion.p>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-8">
          {[
            {
              title: "Easy Payments",
              description: "Seamless and secure payment methods.",
            },
            {
              title: "Instant Gratification",
              description: "Immediate prize claim upon purchase.",
            },
            {
              title: "Exclusive Prizes",
              description: "Unique rewards tailored for professionals.",
            },
            {
              title: "Global Access",
              description:
                "Access to international tournaments and high-tier products.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-xl shadow-xl hover:bg-gray-200 transition-all w-80"
              variants={containerVariants}
              initial="hidden"
              animate={controls}
              transition={{ delay: 0.8 + index * 0.2, duration: 1 }}
            >
              <h3 className="text-2xl font-medium text-gray-800">
                {item.title}
              </h3>
              <p className="text-gray-600 mt-4">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
