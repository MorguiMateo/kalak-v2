import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name} · ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "assets/og-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 64, padding: "0 96px", background: "#20221D", color: "#FAF7F0" }}>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- rendered by ImageResponse */}
        <img src={logoSrc} width={220} height={236} style={{ background: "#FAF7F0", borderRadius: 120, padding: 16 }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase", opacity: 0.8 }}>Alimentación natural · Mendoza</div>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, lineHeight: 1.05, marginTop: 20 }}>
            Comida&nbsp;<span style={{ color: "#F7A06C" }}>real</span>
          </div>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05 }}>para mascotas</div>
        </div>
      </div>
    ),
    size,
  );
}
