import type { MetadataRoute } from "next";
import { routes, site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${site.url}${route === "/" ? "" : route}`,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : route === "/calcula-racion" ? 0.9 : 0.7,
  }));
}
