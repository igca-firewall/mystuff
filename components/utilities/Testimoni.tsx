import React from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { useInView } from "react-intersection-observer";

const Testimoni = () => {
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
      <section className="py-24 px-6 bg-white" ref={ref}>
        <motion.h2
          className="text-5xl font-semibold text-gray-800 text-center mb-16"
          initial={{ opacity: 0, y: 60 }}
          animate={controls}
          transition={{ delay: 0.3, duration: 1 }}
          variants={containerVariants}
        >
          What Our Customers Say
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 text-center items-center mt-2 mb-10 max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Explore the credibility and trust built with users of Particles.<br/>
          This is what others have to say about us.
        </motion.p>

        <div className="flex flex-wrap justify-center gap-12 mt-12">
          {[
            {
              name: "John Doe",
              feedback:
                "The experience was seamless, and the rewards are fantastic!",
              image: "/images/d.jpg",
            },
            {
              name: "Jane Smith",
              feedback: "Absolutely loved it! Winning feels so good!",
              image: "/images/profile.png",
            },
            {
              name: "David Lee",
              feedback: "I got my prize instantly. Couldn’t be happier.",
              image: "/images/th.jpg",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all max-w-sm relative overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
            //   animate={{ opacity: 1, y: 0 }}
              animate={controls}
              variants={containerVariants}
              transition={{ delay: 0.5 + index * 0.2, duration: 1 }}
            >
              <motion.div
                className="overflow-hidden rounded-full w-24 h-24 mx-auto mb-6 border-4 border-white shadow-lg transform hover:scale-110 transition-all"
                whileHover={{ scale: 1.1 }}
                variants={containerVariants}
                animate={controls}
              >
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-800 text-center">
                {testimonial.name}
              </h3>
              <p className="text-sm text-gray-600 mt-4 text-center">
                {testimonial.feedback}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Testimoni;
