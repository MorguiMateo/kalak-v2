/* eslint-disable */
// @ts-nocheck
// Literal copy of the order logic from the old site (Kalak/src/app/hacer-pedido/page.tsx).
// Only changes: state became parameters, prices are injected (the old page hard-coded its own,
// different from config/prices.ts) and window.open returns {message, whatsappUrl}. Do not edit.

export function legacyOrder(input) {
  const {orderDetails, customerName} = input;
  const {PRECIO_FORMULA_PERROS, PRECIO_FORMULA_GATOS, PRECIO_CALCIO, PRECIO_CALDO, PRECIO_CURCUMA} = input.prices;
  const WHATSAPP_NUMBER = "542615038820";

  const calculateTotalPrice = () => {
    let total = 0;
    let dogFormulaPrice = 0;
    let catFormulaPrice = 0;
    let calciumPrice = 0;
    let brothPrice = 0;
    let turmericPrice = 0;

    // Convertir a números
    const dogBags = parseInt(orderDetails.dogFormulaBags) || 0;
    const catBags = parseInt(orderDetails.catFormulaBags) || 0;
    const calcium = parseInt(orderDetails.calcium) || 0;
    const broth = parseInt(orderDetails.broth) || 0;
    const turmeric = parseInt(orderDetails.activatedTurmeric) || 0;

    // Calcular precios individuales
    dogFormulaPrice = dogBags * PRECIO_FORMULA_PERROS;
    catFormulaPrice = catBags * PRECIO_FORMULA_GATOS;
    calciumPrice = calcium * PRECIO_CALCIO;
    brothPrice = broth * PRECIO_CALDO;
    turmericPrice = turmeric * PRECIO_CURCUMA;

    // Calcular total
    total = dogFormulaPrice + catFormulaPrice + calciumPrice + brothPrice + turmericPrice;

    return {
      total,
      dogFormulaPrice,
      catFormulaPrice,
      calciumPrice,
      brothPrice,
      turmericPrice,
    };
  };

  const prepareOrder = () => {
    // Crear mensaje de WhatsApp
    let message = `*PEDIDO KALAK*\n\n`;

    // Agregar detalles del precio
    message += `*PRECIO TOTAL: ${calculateTotalPrice().total} ARS*\n`;
    if (calculateTotalPrice().dogFormulaPrice > 0) {
      message += `Fórmula perros: ${calculateTotalPrice().dogFormulaPrice} ARS\n`;
    }
    if (calculateTotalPrice().catFormulaPrice > 0) {
      message += `Fórmula gatos: ${calculateTotalPrice().catFormulaPrice} ARS\n`;
    }
    if (calculateTotalPrice().calciumPrice > 0) {
      message += `Calcio: ${calculateTotalPrice().calciumPrice} ARS\n`;
    }
    if (calculateTotalPrice().brothPrice > 0) {
      message += `Caldo: ${calculateTotalPrice().brothPrice} ARS\n`;
    }
    if (calculateTotalPrice().turmericPrice > 0) {
      message += `Cúrcuma activada: ${calculateTotalPrice().turmericPrice} ARS\n`;
    }
    message += "\n";

    // Detalles de productos
    message += "*RESUMEN DEL PEDIDO:*\n";
    if (parseInt(orderDetails.dogFormulaBags) > 0) {
      message += `Fórmula perros: ${orderDetails.dogFormulaBags} bolsa(s) de 1kg\n`;
    }

    if (parseInt(orderDetails.catFormulaBags) > 0) {
      message += `Fórmula gatos: ${orderDetails.catFormulaBags} bolsa(s) de 1kg\n`;
    }

    if (parseInt(orderDetails.broth) > 0) {
      message += `Caldo: ${orderDetails.broth} pote(s)\n`;
    }

    if (parseInt(orderDetails.activatedTurmeric) > 0) {
      message += `Cúrcuma activada: ${orderDetails.activatedTurmeric} pote(s)\n`;
    }

    if (parseInt(orderDetails.calcium) > 0) {
      message += `Calcio: ${orderDetails.calcium} pote(s)\n`;
    }

    message += "\n";

    // Datos de contacto
    message += "*Datos de contacto:*\n";
    message += `* Nombre: ${customerName}\n`;
    message += "¡Gracias!";

    // Crear URL de WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    // Abrir WhatsApp en una nueva pestaña
    return {message, whatsappUrl};
  };

  return {calculateTotalPrice, prepareOrder};
}
