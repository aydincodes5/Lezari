import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us | Lezari Jewels",
  description: "Get in touch with the Lezari Jewels team. We'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-[#a37c6b] mb-3">We're here to help</p>
        <h1 className="text-4xl font-serif text-[#1c1917] mb-4">Contact Us</h1>
        <div className="h-px w-16 bg-[#a37c6b] mx-auto" />
        <p className="text-[#78716c] mt-6 max-w-md mx-auto">
          Have a question about your order, a product, or anything else? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Form */}
        <div>
          <h2 className="text-xl font-serif text-[#1c1917] mb-6">Send Us a Message</h2>
          <form className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#78716c] mb-2">First Name</label>
                <input type="text" placeholder="Ayesha" className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#78716c] mb-2">Last Name</label>
                <input type="text" placeholder="Sharma" className="input-field" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-[#78716c] mb-2">Email Address</label>
              <input type="email" placeholder="you@email.com" className="input-field" required />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-[#78716c] mb-2">Phone (Optional)</label>
              <input type="tel" placeholder="+91 98765 43210" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-[#78716c] mb-2">Subject</label>
              <select className="input-field bg-white">
                <option value="">Select a subject</option>
                <option value="order">Order Enquiry</option>
                <option value="product">Product Question</option>
                <option value="return">Return / Exchange</option>
                <option value="shipping">Shipping Query</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-[#78716c] mb-2">Message</label>
              <textarea
                rows={5}
                placeholder="How can we help you?"
                className="input-field resize-none"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-serif text-[#1c1917] mb-6">Get in Touch</h2>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#fdf8f6] border border-[#eaddd7] flex-shrink-0">
                <Mail className="h-5 w-5 text-[#a37c6b]" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-[#78716c] mb-1">Email</p>
                <a href="mailto:hello@lezarijewels.com" className="text-[#1c1917] hover:text-[#a37c6b] transition-colors text-sm">
                  hello@lezarijewels.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#fdf8f6] border border-[#eaddd7] flex-shrink-0">
                <Phone className="h-5 w-5 text-[#a37c6b]" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-[#78716c] mb-1">Phone / WhatsApp</p>
                <a href="tel:+919876543210" className="text-[#1c1917] hover:text-[#a37c6b] transition-colors text-sm">
                  +91 98765 43210
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#fdf8f6] border border-[#eaddd7] flex-shrink-0">
                <Clock className="h-5 w-5 text-[#a37c6b]" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-[#78716c] mb-1">Support Hours</p>
                <p className="text-[#1c1917] text-sm">Monday – Saturday, 10AM – 6PM IST</p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-8 bg-[#fdf8f6] border border-[#eaddd7]">
            <h3 className="font-serif text-xl text-[#1c1917] mb-4">We typically reply within</h3>
            <p className="text-3xl font-serif text-[#a37c6b] mb-2">24 hours</p>
            <p className="text-sm text-[#78716c]">
              For urgent queries, feel free to reach out on WhatsApp for a faster response.
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-xs font-medium uppercase tracking-widest text-[#78716c] mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/lezarijewels"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 border border-[#e7e5e4] text-xs uppercase tracking-widest font-medium text-[#1c1917] hover:bg-[#f5f5f4] transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
