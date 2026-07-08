import Image from "next/image";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";

// Inline Custom SVG Icons for Facebook and LinkedIn to bypass missing brand icons in certain lucide-react versions
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function Footer() {
  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com/lavanderiaelcobre",
      icon: FacebookIcon,
      label: "Lavandería El Cobre Calama",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/lavanderia-el-cobre",
      icon: LinkedinIcon,
      label: "Lavandería El Cobre SpA",
    },
  ];

  return (
    <footer className="bg-stone-50 border-t border-stone-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          {/* Brand Info (5 columns) */}
          <div className="md:col-span-5 space-y-6">
            {/* Logo + Text */}
            <div className="flex items-center gap-3">
              <Image
                src="/logo.webp"
                alt="Logo Lavandería El Cobre"
                width={44}
                height={44}
                className="h-11 w-auto object-contain"
              />
              <span className="text-lg font-extrabold tracking-tight text-stone-900 font-display flex gap-1 leading-none">
                <span>Lavandería</span>
                <span className="text-brand-700">El Cobre</span>
              </span>
            </div>
            <p className="text-stone-600 text-sm max-w-sm leading-relaxed">
              Líderes en servicios de lavado y sanitización industrial y de hogar en Calama. Comprometidos con el cuidado textil de excelencia, la puntualidad en los plazos de entrega y la sustentabilidad ecológica.
            </p>
          </div>

          {/* Social Links (3 columns) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-wider text-brand-700 font-extrabold">Nuestras Redes</h4>
            <ul className="space-y-3.5">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <li key={social.name}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-600 hover:text-brand-650 text-sm font-semibold transition-colors flex items-center gap-2.5 group w-fit"
                    >
                      <div className="p-2 bg-stone-100 group-hover:bg-brand-50 text-stone-750 group-hover:text-brand-600 rounded-lg transition-colors">
                        <IconComponent className="w-4 h-4 shrink-0" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-stone-900 group-hover:text-brand-650">{social.name}</span>
                        <span className="text-[10px] text-stone-500 font-medium">{social.label}</span>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Direct Address & Contact Info (4 columns) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-wider text-brand-700 font-extrabold">Información de Contacto</h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-stone-600 text-sm">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-850">Dirección Sucursal:</p>
                  <p className="text-xs text-stone-550 mt-0.5">
                    Avenida Balmaceda N°1276,<br />
                    Calama, Región de Antofagasta
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-stone-600 text-sm">
                <Phone className="w-4 h-4 text-brand-600 shrink-0" />
                <div>
                  <a
                    href="tel:+56959594156"
                    className="hover:text-brand-650 font-bold transition-colors text-stone-800"
                  >
                    +56 9 5959 4156
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3 text-stone-600 text-sm">
                <Mail className="w-4 h-4 text-brand-600 shrink-0" />
                <div>
                  <a
                    href="mailto:ventas@lavanderiaelcobrespa.com"
                    className="hover:text-brand-650 font-bold transition-colors text-stone-800 break-all"
                  >
                    ventas@lavanderiaelcobrespa.com
                  </a>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom (Copyright) */}
        <div className="pt-8 border-t border-stone-250 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-500 font-medium">
          <p>
            © {new Date().getFullYear()} Lavandería El Cobre SpA. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <a
              href="https://maps.google.com/?q=Avenida+Balmaceda+1276,+Calama"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-650 flex items-center gap-1 transition-colors"
            >
              <span>Cómo llegar</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
