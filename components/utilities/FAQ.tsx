import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Chevron icons for accordion
import { useInView } from 'react-intersection-observer';

const FAQ = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
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
  const toggleFAQ = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  const faqs = [
    {
      question: 'How do I purchase a ticket?',
      answer: "Simply click on the 'Buy Now' button under the ticket of your choice.",
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards and digital wallets.',
    },
    {
      question: 'How are prizes claimed?',
      answer: 'Prizes are credited to your account instantly upon scratching the card.',
    },
    {
      question: 'Can I use these tickets internationally?',
      answer: 'Yes, the tickets provide global access to tournaments.',
    },
    {
      question: 'Are there any hidden fees?',
      answer: 'No, the price listed is the final cost.',
    },
  ];

  return (
    <section className="relative py-24 px-6 bg-white overflow-hidden" ref={ref}>
      <motion.h2
        className="text-5xl font-extrabold text-gray-900 text-center"
        initial={{ opacity: 0, y: 60 }}
        animate={controls}
        transition={{ delay: 0.3, duration: 1 }}
        variants={containerVariants}

      >
        Frequently Asked Questions
      </motion.h2>

      <div className="mt-12 max-w-5xl mx-auto grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.2, duration: 1 }}
            variants={containerVariants}
          >
            <div
              className="flex justify-between items-center cursor-pointer transition-transform hover:scale-105"
              onClick={() => toggleFAQ(index)}
            >
              <motion.h3
                className="text-xl font-semibold text-gray-800 transition-colors hover:text-indigo-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                variants={containerVariants}
              >
                {faq.question}
              </motion.h3>

              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: expanded === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-xl text-indigo-500"
                variants={containerVariants}
              >
                {expanded === index ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </motion.div>
            </div>

            {expanded === index && (
              <motion.p
                className="mt-4 text-gray-600 leading-relaxed text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                variants={containerVariants}
                transition={{ duration: 0.3 }}
              >
                {faq.answer}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Decorative SVG for visual depth */}
      {/* <svg className="absolute bottom-0 left-0 right-0 h-48 text-gray-200 opacity-40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="currentColor" d="M0,288L1440,160L1440,320L0,320Z"></path>
      </svg> */}
    </section>
  );
};

export default FAQ;
