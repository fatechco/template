import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Get in Touch</h2>
          <div className="space-y-4">
            {[
              { icon: Mail, label: "Email", value: "support@kemedar.com" },
              { icon: Phone, label: "Phone", value: "+20 2 XXXX XXXX" },
              { icon: MapPin, label: "Address", value: "Cairo, Egypt" },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <c.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">{c.label}</div>
                  <div className="font-medium">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border rounded-xl p-6">
          <h2 className="font-bold mb-4">Send a Message</h2>
          <div className="space-y-3">
            <input type="text" placeholder="Your Name" className="w-full px-4 py-2.5 border rounded-lg text-sm" />
            <input type="email" placeholder="Email Address" className="w-full px-4 py-2.5 border rounded-lg text-sm" />
            <textarea placeholder="Your Message" rows={4} className="w-full px-4 py-2.5 border rounded-lg text-sm resize-none" />
            <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700">
              <Send className="w-4 h-4" />Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
