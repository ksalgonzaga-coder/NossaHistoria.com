import { Mail, Instagram, MessageCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Footer() {
  const { data: weddingInfo } = trpc.wedding.get.useQuery();

  // Parse social media from wedding info - use type assertion for new fields
  const weddingData = weddingInfo as any;
  const socialMedia = {
    instagram: weddingData?.instagramLinks ? weddingData.instagramLinks.split(",").filter(Boolean) : [],
    whatsapp: weddingData?.whatsappLinks ? weddingData.whatsappLinks.split(",").filter(Boolean) : [],
    email: weddingData?.emailLinks ? weddingData.emailLinks.split(",").filter(Boolean) : [],
  };

  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Sobre */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sobre</h3>
            <p className="text-gray-400">
              Lista de presentes para casamento. Contribua com presentes ou valores
              para ajudar o casal a realizar seus sonhos.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition">
                  Início
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-white transition">
                  Presentes
                </a>
              </li>
              <li>
                <a href="/contribute" className="hover:text-white transition">
                  Contribuição
                </a>
              </li>
              <li>
                <a href="/posts" className="hover:text-white transition">
                  Mural
                </a>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
            <div className="flex flex-col gap-4">
              {/* Instagram */}
              {socialMedia.instagram.length > 0 && (
                <div className="flex items-start gap-3">
                  <Instagram className="w-5 h-5 mt-1 flex-shrink-0 text-pink-500" />
                  <div className="flex flex-col gap-2">
                    {socialMedia.instagram.map((link: string, idx: number) => (
                      <a
                        key={idx}
                        href={link.startsWith("http") ? link : `https://instagram.com/${link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-pink-500 transition text-sm"
                      >
                        {link.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* WhatsApp */}
              {socialMedia.whatsapp.length > 0 && (
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 mt-1 flex-shrink-0 text-green-500" />
                  <div className="flex flex-col gap-2">
                    {socialMedia.whatsapp.map((link: string, idx: number) => (
                      <a
                        key={idx}
                        href={link.startsWith("http") ? link : `https://wa.me/${link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-green-500 transition text-sm"
                      >
                        {link.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Email */}
              {socialMedia.email.length > 0 && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 mt-1 flex-shrink-0 text-blue-500" />
                  <div className="flex flex-col gap-2">
                    {socialMedia.email.map((email: string, idx: number) => (
                      <a
                        key={idx}
                        href={`mailto:${email}`}
                        className="text-gray-400 hover:text-blue-500 transition text-sm"
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy; 2026 Wedding Registry. Todos os direitos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">
                Privacidade
              </a>
              <a href="#" className="hover:text-white transition">
                Termos
              </a>
              <a href="#" className="hover:text-white transition">
                Suporte
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
