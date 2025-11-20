"use client";

import { useState } from 'react';

const faqs = [
  {
    category: 'Products',
    questions: [
      {
        q: 'What is the lifespan of LED lights?',
        a: 'Our LED lights typically last 25,000 to 50,000 hours, which is 25-50 times longer than traditional incandescent bulbs. This translates to approximately 10-20 years of normal use.'
      },
      {
        q: 'Are LED lights energy efficient?',
        a: 'Yes! LED lights use up to 80% less energy than traditional bulbs. They convert most of their energy into light rather than heat, making them highly efficient and cost-effective.'
      },
      {
        q: 'Can I use LED bulbs with dimmer switches?',
        a: 'Many of our LED products are dimmable, but not all. Check the product specifications for "Dimmable" in the features list. Using non-dimmable LEDs with dimmer switches may cause flickering or damage.'
      }
    ]
  },
  {
    category: 'Orders & Shipping',
    questions: [
      {
        q: 'What are the shipping options?',
        a: 'We offer free standard shipping on orders over $100. Express shipping is available for an additional fee. Most orders ship within 1-2 business days and arrive within 3-7 business days.'
      },
      {
        q: 'Do you ship internationally?',
        a: 'Currently, we ship within the continental United States. International shipping options are coming soon. Contact us for special requests.'
      },
      {
        q: 'Can I track my order?',
        a: 'Yes! Once your order ships, you\'ll receive a tracking number via email. You can use this to monitor your package\'s journey in real-time.'
      }
    ]
  },
  {
    category: 'Returns & Warranty',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with your purchase, return it in original condition for a full refund. Some restrictions may apply.'
      },
      {
        q: 'Do LED lights come with a warranty?',
        a: 'Yes! All our products come with manufacturer warranties ranging from 1 to 5 years depending on the product. Premium products include extended warranty options.'
      },
      {
        q: 'What if my product arrives damaged?',
        a: 'Contact us immediately with photos of the damage. We\'ll arrange for a replacement or full refund at no cost to you. Your satisfaction is our priority.'
      }
    ]
  },
  {
    category: 'Technical',
    questions: [
      {
        q: 'What color temperature should I choose?',
        a: 'Warm White (2700-3000K) is ideal for residential spaces, creating a cozy atmosphere. Cool White (5000-6500K) is better for offices and workspaces. Neutral White (4000K) works well in both settings.'
      },
      {
        q: 'How do I calculate how many lumens I need?',
        a: 'As a general rule: Living rooms need 1,500-3,000 lumens, kitchens 3,000-4,000 lumens, bathrooms 4,000-8,000 lumens, and offices 3,000-6,000 lumens. Our experts can help with specific requirements.'
      },
      {
        q: 'Are LED lights compatible with smart home systems?',
        a: 'Many of our products in Zone 3 (Smart Lighting) are compatible with Alexa, Google Home, and other smart home platforms. Look for \"Smart\" or \"Wi-Fi Enabled\" in product features.'
      }
    ]
  },
  {
    category: 'Installation',
    questions: [
      {
        q: 'Can I install LED lights myself?',
        a: 'Many LED products are designed for easy DIY installation. However, hardwired fixtures should be installed by a licensed electrician. Check product descriptions for installation requirements.'
      },
      {
        q: 'Do you offer installation services?',
        a: 'We partner with certified electricians in many areas. Contact us with your zip code to see if installation services are available in your location.'
      },
      {
        q: 'What tools do I need for installation?',
        a: 'Most installations require basic tools like a screwdriver and wire strippers. Specific requirements are listed in each product\'s installation guide included with your purchase.'
      }
    ]
  }
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl font-bold text-white mb-6 text-center glow-text-subtle">
          Frequently Asked Questions
        </h1>
        <p className="text-center text-white/60 mb-12">
          Find answers to common questions about our products and services
        </p>

        <div className="space-y-8">
          {faqs.map((category, catIndex) => (
            <div key={catIndex} className="bg-black border-2 border-white/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, qIndex) => {
                  const id = `${catIndex}-${qIndex}`;
                  const isOpen = openItems.includes(id);
                  
                  return (
                    <div
                      key={qIndex}
                      className="border-b border-white/10 last:border-0 pb-4 last:pb-0"
                    >
                      <button
                        onClick={() => toggleItem(id)}
                        className="w-full text-left flex items-start justify-between gap-4 group"
                      >
                        <span className="text-white font-semibold group-hover:text-white/80 transition">
                          {faq.q}
                        </span>
                        <svg
                          className={`w-5 h-5 text-white flex-shrink-0 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {isOpen && (
                        <p className="mt-3 text-white/70 animate-slide-up">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-black border-2 border-white/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h2>
          <p className="text-white/70 mb-6">
            Our customer support team is here to help you with any questions or concerns.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition font-semibold"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
