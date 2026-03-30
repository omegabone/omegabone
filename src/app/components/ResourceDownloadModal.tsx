import { useState } from "react";
import { X, Download, Mail, CheckCircle } from "lucide-react";

interface ResourceDownloadModalProps {
  resource: { label: string; file: string } | null;
  onClose: () => void;
}

export function ResourceDownloadModal({ resource, onClose }: ResourceDownloadModalProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!resource) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");

    const apiKey = import.meta.env.VITE_KIT_API_KEY;
    const formId = import.meta.env.VITE_KIT_FORM_ID;

    try {
      const res = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey, email }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("Kit subscribe failed:", res.status, body);
      }
    } catch (err) {
      console.error("Kit subscribe error:", err);
    }

    setSubmitted(true);

    // Trigger download
    const link = document.createElement("a");
    link.href = `/resources/${resource.file}`;
    link.download = resource.file;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors"
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <div className="w-12 h-12 rounded-2xl bg-[#e8f0fe] text-[#1a56db] flex items-center justify-center mb-5">
              <Download size={22} />
            </div>
            <h3 className="text-black mb-1" style={{ fontWeight: 800, fontSize: "1.25rem" }}>
              {resource.label}
            </h3>
            <p className="text-gray-500 text-sm mb-6" style={{ lineHeight: 1.6 }}>
              Enter your email to get your free download instantly. No spam, ever.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-black outline-none focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20 transition-all"
                />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-[#1a56db] text-white px-6 py-3 rounded-xl hover:bg-[#1544b5] transition-colors"
                style={{ fontWeight: 700 }}
              >
                <Download size={16} />
                Download Free Resource
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={28} />
            </div>
            <h3 className="text-black mb-2" style={{ fontWeight: 800, fontSize: "1.2rem" }}>
              Your download is starting!
            </h3>
            <p className="text-gray-500 text-sm mb-6" style={{ lineHeight: 1.6 }}>
              Thank you! If your download doesn't start automatically,{" "}
              <a
                href={`/resources/${resource.file}`}
                download={resource.file}
                className="text-[#1a56db] underline"
                style={{ fontWeight: 600 }}
              >
                click here
              </a>.
            </p>
            <button
              onClick={onClose}
              className="text-gray-400 text-sm hover:text-black transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
