import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import { whatsappUrl } from "@/lib/whatsapp";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="fixed right-5 bottom-5 z-40 grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_10px_28px_-8px_rgb(37_211_102/.7)] transition-transform hover:scale-108 active:scale-95"
    >
      <WhatsAppIcon />
    </a>
  );
}
