"use client";

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-5xl font-bold text-white mb-12 text-center glow-text-subtle">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-black border-2 border-white/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
            
            {submitted ? (
              <div className="bg-white/10 border border-white/20 rounded-lg p-6 text-center">
                <svg className="w-16 h-16 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-white text-xl">Thank you! We&apos;ll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Subject *</label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/60"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="quote">Request Quote</option>
                    <option value="support">Technical Support</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white mb-2">Message *</label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60 resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-white text-black rounded-lg hover:bg-white/90 transition font-semibold"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-black border-2 border-white/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
              <div className="space-y-4 text-white/80">
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-white flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Address</h3>
                    <p>123 LED Street<br />Lighting City, LC 12345</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-white flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Phone</h3>
                    <p>(555) 123-4567</p>
                    <p className="text-sm">Mon-Fri: 9AM - 6PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-white flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email</h3>
                    <p>info@ledworld.com</p>
                    <p>support@ledworld.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black border-2 border-white/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Business Hours</h2>
              <div className="space-y-2 text-white/80">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
