export const site = {
  name: "Kalak",
  tagline: "Comida real para mascotas",
  city: "Mendoza",
  whatsapp: {
    number: "542615038820",
    display: "+54 261 503 8820",
    defaultMessage: "Hola, me contacto desde la web de KALAK.",
  },
  email: "contacto.kalak@gmail.com",
  social: {
    instagram: "https://www.instagram.com/kalak.comidarealparamascotas/",
  },
  pickupPoints: [
    { name: "Centro (Zona Alameda)", mapUrl: "https://maps.app.goo.gl/npMK5qY5w6spqmhx5" },
    { name: "6ta Sección (Vet. Mendieta)", mapUrl: "https://maps.app.goo.gl/14HWRJsVpGQCjvTDA" },
    { name: "Carrodilla (Luján de Cuyo)", mapUrl: "https://maps.app.goo.gl/YPDKLkjedXLqMsabA" },
    { name: "El Challao (Las Heras)", mapUrl: "https://maps.app.goo.gl/V4BJbgiNXkwetpDa9" },
  ],
} as const;

export const mainNav = [
  { href: "/dieta-kalak", label: "Dieta Kalak" },
  { href: "/perros", label: "Perros" },
  { href: "/gatos", label: "Gatos" },
  { href: "/suplementos", label: "Suplementos" },
  { href: "/mini-cursos", label: "Mini cursos" },
  { href: "/transicion", label: "Transición" },
] as const;

export const ctaLinks = {
  calculator: { href: "/calcula-racion", label: "Calcula su ración" },
  order: { href: "/hacer-pedido", label: "Hacer el pedido" },
} as const;
