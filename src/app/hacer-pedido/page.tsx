import type { Metadata } from "next";
import { PhotoBanner } from "@/components/ui/PhotoBanner";
import { OrderForm } from "@/features/order/OrderForm";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Hacer el pedido",
  description: "Hacé tu pedido de comida natural Kalak por WhatsApp.",
};

export default function HacerPedidoPage() {
  return (
    <>
      <PhotoBanner
        image={images.perroComiendo}
        eyebrow="Pedido"
        title={
          <>
            Hacer un <em>pedido</em>
          </>
        }
      >
        <p className="mt-3 max-w-[46ch] text-white/85">Completa el formulario para realizar tu pedido de alimentación natural</p>
      </PhotoBanner>
      <OrderForm />
    </>
  );
}
