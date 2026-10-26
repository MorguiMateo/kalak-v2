import Image from "next/image";
import { cn } from "@/lib/cn";
import fox from "../../../public/images/logo-zorro.webp";
import full from "../../../public/images/logo.webp";

/** Fox in its capsule. Height is set by the caller; width follows the aspect ratio. */
export function LogoMark({ className, preload }: { className?: string; preload?: boolean }) {
  return (
    <Image src={fox} alt="Kalak" sizes="48px" preload={preload} className={cn("w-auto", className)} />
  );
}

export function LogoFull({ className }: { className?: string }) {
  return (
    <Image
      src={full}
      alt="Kalak, comida real para mascotas"
      sizes="80px"
      className={cn("w-auto", className)}
    />
  );
}
