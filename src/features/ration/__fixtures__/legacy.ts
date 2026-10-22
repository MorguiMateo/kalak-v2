/* eslint-disable */
// @ts-nocheck
// Literal copy of the calculator logic from the old site
// (Kalak/src/app/calcula-racion/page.tsx, lines 34-51, 307-638, 757-925).
// Only changes: component state became function parameters, console.log calls were removed
// and the WhatsApp window.open returns {message, whatsappUrl}. Used as golden reference; do not edit.

export interface Pet {
  id: string;
  type: "dog" | "cat" | null;
  gender: "male" | "female" | null;
  name: string;
  breed: string;
  age: string;
  agePercentage: number | null;
  isSterilized: boolean | null;
  weight: string;
  bodyCondition: "delgado" | "normal" | "sobrepeso" | null;
  bodyConditionPercentage: number | null;
  activity: "bajo" | "normal" | "alto" | null;
  activityPercentage: number | null;
  dietType: "raw" | "cooked" | "mixed" | "supplements" | null;
  supplements: string[];
}

// Age options of step 5 (page.tsx lines 1397-1400): agePercentage comes from here.
export const ageOptions = [
                            {label: "1-6 meses", value: "1-6 meses", percentage: 8},
                            {label: "7-12 meses", value: "7-12 meses", percentage: 6},
                            {label: "1-6 años", value: "1-6 años", percentage: 3},
                            {label: "+7 años", value: "+7 años (geronte)", percentage: 4},
                          ];

export type LegacyInput = {
  pets: Pet[];
  supplyDuration: "1_week" | "2_weeks" | "1_month" | "custom" | null;
  customDays: string;
  customerName: string;
  customerPhone: string;
  prices: {
    PRECIO_FORMULA_PERROS: number;
    PRECIO_FORMULA_GATOS: number;
    PRECIO_CALDO: number;
    PRECIO_CURCUMA: number;
    PRECIO_CALCIO: number;
  };
};

export function legacy(input: LegacyInput) {
  const {pets, supplyDuration, customDays, customerName, customerPhone} = input;
  const {PRECIO_FORMULA_PERROS, PRECIO_FORMULA_GATOS, PRECIO_CALDO, PRECIO_CURCUMA, PRECIO_CALCIO} = input.prices;
  // Never updated in the old page: always 40.
  const commercialFoodPercentage = 40;

  const prepareAndSendOrder = () => {
    // Nombre del cliente, teléfono y texto de pedido
    let message = `*PEDIDO KALAK*\n\n`;

    // Calcular y agregar duración del suministro
    let durationText = "";
    let durationDays = 0;

    if (supplyDuration === "1_week") {
      durationText = "1 semana";
      durationDays = 7;
    } else if (supplyDuration === "2_weeks") {
      durationText = "1 quincena";
      durationDays = 15;
    } else if (supplyDuration === "1_month") {
      durationText = "1 mes";
      durationDays = 30;
    } else if (supplyDuration === "custom" && customDays.trim()) {
      durationText = `${customDays} días`;
      durationDays = parseInt(customDays);
    } else {
      // Valor predeterminado si no hay duración seleccionada
      durationText = "1 mes";
      durationDays = 30;
    }

    // Agregar duración al mensaje
    message += `*Duración del suministro:* ${durationText}\n\n`;

    // Calculate total Kalak needed and prepare pet-specific data
    let totalKalakKilos = 0;

    interface PetInfo {
      pet: Pet;
      dailyKalak: number;
      totalKalakGrams: number;
      petKalakKilos: number;
      caldoDosage: {dailyDose: number; monthlyPots: number} | undefined;
      curcumaDosage: {dailyDose: number; monthlyPots: number} | undefined;
      calcioDosage: {recommended: boolean; monthlyPots: number; message: string} | undefined;
    }

    const petData: PetInfo[] = [];

    // Para depuración, imprimir los datos de cada mascota

    // Primero, calculamos todos los datos para cada mascota y los almacenamos
    pets.forEach((pet) => {
      // Crear un objeto para almacenar los datos de esta mascota
      const petInfo: PetInfo = {
        pet: pet,
        dailyKalak: 0,
        totalKalakGrams: 0,
        petKalakKilos: 0,
        caldoDosage: undefined,
        curcumaDosage: undefined,
        calcioDosage: undefined,
      };

      // Calculate Kalak quantities if applicable
      if (pet.dietType && pet.dietType !== "supplements") {
        const portions = calculateDailyPortion(pet);

        // Log para depuración

        petInfo.dailyKalak = pet.dietType === "mixed" ? portions.kalak : portions.kalakOnly;
        petInfo.totalKalakGrams = petInfo.dailyKalak * durationDays;
        petInfo.petKalakKilos = Math.ceil(petInfo.totalKalakGrams / 1000);

        // Add to total
        totalKalakKilos += petInfo.petKalakKilos;

        // Log para confirmar los cálculos
      }

      // Calculate supplement dosages for this pet
      if (pet.supplements && pet.supplements.length > 0) {
        if (pet.supplements.includes("Caldo")) {
          petInfo.caldoDosage = calculateCaldoDosage(pet);
        }

        if (pet.supplements.includes("Curcuma activada")) {
          petInfo.curcumaDosage = calculateCurcumaActivadaDosage(pet);
        }

        if (pet.supplements.includes("Calcio")) {
          petInfo.calcioDosage = calculateCalcioDosage(pet);
        }
      }

      // Store this pet's data
      petData.push(petInfo);
    });

    // Contadores para el resumen agrupado
    let totalFormulaDogs = 0;
    let totalFormulaCats = 0;
    let totalCaldo = 0;
    let totalCurcuma = 0;
    let totalCalcio = 0;

    // Calcular totales agrupados por tipo de producto
    petData.forEach((data) => {
      const pet = data.pet;

      // Contar Kalak por tipo de mascota
      if (pet.dietType && pet.dietType !== "supplements" && data.petKalakKilos > 0) {
        if (pet.type === "dog") {
          totalFormulaDogs += data.petKalakKilos;
        } else if (pet.type === "cat") {
          totalFormulaCats += data.petKalakKilos;
        }
      }

      // Contar suplementos
      if (pet.supplements && pet.supplements.length > 0) {
        if (data.caldoDosage) {
          totalCaldo += data.caldoDosage.monthlyPots;
        }

        if (data.curcumaDosage) {
          totalCurcuma += data.curcumaDosage.monthlyPots;
        }

        if (data.calcioDosage && data.calcioDosage.monthlyPots > 0) {
          totalCalcio += data.calcioDosage.monthlyPots;
        }
      }
    });

    // Calcular y agregar el precio total
    const prices = calculateTotalPrice(
      totalFormulaDogs,
      totalFormulaCats,
      totalCalcio,
      totalCaldo,
      totalCurcuma,
    );

    // Agregar sección de precios al inicio
    message += `*PRECIO TOTAL: ${prices.total} ARS*\n`;
    if (prices.formulaDogsPrice > 0) message += `Fórmula perros: ${prices.formulaDogsPrice} ARS\n`;
    if (prices.formulaCatsPrice > 0) message += `Fórmula gatos: ${prices.formulaCatsPrice} ARS\n`;
    if (prices.calcioPrice > 0) message += `Calcio: ${prices.calcioPrice} ARS\n`;
    if (prices.caldoPrice > 0) message += `Caldo: ${prices.caldoPrice} ARS\n`;
    if (prices.curcumaPrice > 0) message += `Cúrcuma activada: ${prices.curcumaPrice} ARS\n`;
    message += "\n";

    // Now build the message with the pre-calculated data
    message += "*RESUMEN DEL PEDIDO:*\n";

    // Resumen agrupado por tipo de producto
    if (totalFormulaDogs > 0) {
      message += `Fórmula perros: ${totalFormulaDogs} bolsa(s) de 1kg\n`;
    }

    if (totalFormulaCats > 0) {
      message += `Fórmula gatos: ${totalFormulaCats} bolsa(s) de 1kg\n`;
    }

    if (totalCaldo > 0) {
      message += `Caldo: ${totalCaldo} pote(s)\n`;
    }

    if (totalCurcuma > 0) {
      message += `Cúrcuma activada: ${totalCurcuma} pote(s)\n`;
    }

    if (totalCalcio > 0) {
      message += `Calcio: ${totalCalcio} pote(s)\n`;
    }

    message += "\n";

    // First, show all orders at the top - now with names in uppercase and proper formatting
    petData.forEach((data) => {
      const pet = data.pet;

      message += `*${pet.name.toUpperCase()}:*\n`;

      if (pet.dietType === "supplements") {
        message += `* Solo suplementos\n`;
      } else if (pet.dietType === "mixed") {
        message += `* Kalak para ${durationText}: ${data.petKalakKilos} bolsa(s) de 1kg (${data.dailyKalak.toFixed(0)}g/día)\n`;
        message += `* Alimento comercial: 40% de lo habitual\n`;
      } else if (pet.dietType === "raw" || pet.dietType === "cooked") {
        message += `* Kalak para ${durationText}: ${data.petKalakKilos} bolsa(s) de 1kg (${data.dailyKalak.toFixed(0)}g/día)\n`;
      }

      // Add supplements with quantities
      if (pet.supplements && pet.supplements.length > 0) {
        message += "*Suplementos:*\n";

        if (pet.supplements.includes("Caldo") && data.caldoDosage) {
          message += `* Caldo: ${data.caldoDosage.monthlyPots} pote(s) (${data.caldoDosage.dailyDose} cucharada(s)/día)\n`;
        }

        if (pet.supplements.includes("Curcuma activada") && data.curcumaDosage) {
          message += `* Cúrcuma activada: ${data.curcumaDosage.monthlyPots} pote(s) (${data.curcumaDosage.dailyDose} cucharadita(s)/día)\n`;
        }

        if (
          pet.supplements.includes("Calcio") &&
          data.calcioDosage &&
          data.calcioDosage.monthlyPots > 0
        ) {
          message += `* Calcio: ${data.calcioDosage.monthlyPots} pote(s) al mes\n`;
        }
      }
    });

    message += "\n*DETALLES POR MASCOTA:*\n\n";

    // Then show detailed information for each pet - with name in uppercase
    petData.forEach((data) => {
      const pet = data.pet;

      message += `*${pet.name.toUpperCase()}:*\n`;
      message += "*Resumen de alimentación diaria:*\n";
      message += `* Tipo de dieta: ${getDietTypeText(pet.dietType)}\n`;

      if (pet.dietType === "mixed") {
        const portions = calculateDailyPortion(pet);

        message += `* Kalak diario: ${portions.kalak.toFixed(0)} g/día\n`;
        message += `* Alimento comercial: 40% de lo habitual\n`;
      } else if (pet.dietType && pet.dietType !== "supplements") {
        const portions = calculateDailyPortion(pet);

        message += `* Kalak diario: ${portions.kalakOnly.toFixed(0)} g/día\n`;
      }

      // Add cooking suggestion if applicable
      if (pet.dietType === "cooked") {
        message += "\n*Sugerencia de cocción:*\n";
        message += "1) Descongelar en la heladera la porción adecuada\n";
        message +=
          "2) Cocinar a gusto (semicocido/cocido) en olla, sartén, o plancha, o en microondas, agregar líquido a la cocción\n";
        message += "3) Agregar los suplementos\n";
        message += "4) Ofrecer preferentemente tibio\n";
        message += "Una vez cocido, mantener refrigerado en la heladera\n";
        message += "Mantener una adecuada higiene de los utensilios, platos y bebederos\n";
      }

      message += "\n*Datos de " + pet.name.toUpperCase() + ":*\n";
      message += `* Especie: ${pet.type === "dog" ? "Perro" : "Gato"}\n`;
      message += `* Sexo: ${
        pet.type === "dog"
          ? pet.gender === "male"
            ? "Macho"
            : "Hembra"
          : pet.gender === "male"
            ? "Macho"
            : "Hembra"
      }\n`;
      message += `* Raza: ${pet.breed}\n`;
      message += `* Edad: ${pet.age}\n`;
      message += `* Esterilizado: ${pet.isSterilized ? "Sí" : "No"}\n`;
      message += `* Peso: ${pet.weight} kg\n`;
      message += `* Condición corporal: ${
        pet.bodyCondition === "delgado"
          ? "Delgado"
          : pet.bodyCondition === "normal"
            ? "Normal"
            : "Sobrepeso"
      }\n`;
      message += `* Nivel de actividad: ${
        pet.activity === "bajo" ? "Baja" : pet.activity === "normal" ? "Media" : "Alta"
      }\n\n`;
    });

    message += "*Datos de contacto:*\n";
    message += `* Nombre: ${customerName}\n`;
    message += `* Teléfono: ${customerPhone}\n`;
    message += "¡Gracias!";

    // Prepare the phone number
    const phoneNumber = "+54 261 503-8820";

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
      message,
    )}`;

    // Open WhatsApp in a new tab
    return {message, whatsappUrl};
  };

  const getDietTypeText = (dietType: string | null) => {
    switch (dietType) {
      case "raw":
        return "Natural cruda";
      case "cooked":
        return "Natural cocida";
      case "mixed":
        return "Mixta (60% natural cocida + 40% comercial)";
      case "supplements":
        return "Suplementos (comercial + suplementos)";
      default:
        return "";
    }
  };

  // Marked as unused but kept for potential future use

  const calculateTotalPrice = (
    formulaDogsKg: number,
    formulaCatsKg: number,
    calcioPots: number,
    caldoPots: number = 0,
    curcumaPots: number = 0,
  ) => {
    const formulaDogsPrice = formulaDogsKg * PRECIO_FORMULA_PERROS;
    const formulaCatsPrice = formulaCatsKg * PRECIO_FORMULA_GATOS;
    const calcioPrice = calcioPots * PRECIO_CALCIO;
    const caldoPrice = caldoPots * PRECIO_CALDO;
    const curcumaPrice = curcumaPots * PRECIO_CURCUMA;

    return {
      formulaDogsPrice,
      formulaCatsPrice,
      calcioPrice,
      caldoPrice,
      curcumaPrice,
      total: formulaDogsPrice + formulaCatsPrice + calcioPrice + caldoPrice + curcumaPrice,
    };
  };

  const calculateDailyPortion = (pet: Pet) => {
    if (!pet.weight) return {total: 0, kalak: 0, commercial: 0, kalakOnly: 0};

    const weight = parseFloat(pet.weight);
    let percentage = pet.agePercentage || 0;

    if (pet.bodyCondition === "sobrepeso") {
      if (pet.age === "+7 años (geronte)") {
        percentage = 3;
      } else {
        percentage = 2;
      }
    } else if (pet.bodyCondition === "delgado") {
      if (pet.age === "+7 años (geronte)") {
        percentage = 4;
      } else {
        percentage = 4;
      }
    }

    if (
      pet.type === "dog" &&
      weight < 5 &&
      pet.age === "1-6 años" &&
      pet.bodyCondition === "normal"
    ) {
      percentage = 4;
    }

    if (pet.type === "dog" && weight < 5 && pet.bodyCondition === "sobrepeso") {
      percentage = 3;
    }

    const totalGramsPerDay = weight * percentage * 10;
    let kalakGramsPerDay = totalGramsPerDay;
    let commercialGramsPerDay = 0;
    const kalakOnlyGramsPerDay = totalGramsPerDay;

    // Adjust based on diet type
    if (pet.dietType === "mixed") {
      // Mixed diet: 60% Kalak, 40% commercial
      kalakGramsPerDay = totalGramsPerDay * 0.6;
      commercialGramsPerDay = totalGramsPerDay * 0.4;
    } else if (pet.dietType === "supplements") {
      // Mainly commercial with supplements
      kalakGramsPerDay = 0;
      commercialGramsPerDay = totalGramsPerDay;
    }

    return {
      total: totalGramsPerDay,
      kalak: kalakGramsPerDay,
      commercial: commercialGramsPerDay,
      kalakOnly: kalakOnlyGramsPerDay,
      percentage: percentage,
    };
  };

  // Calculate supplement dosages
  const calculateCaldoDosage = (pet: Pet) => {
    if (!pet.weight) return {dailyDose: 0, monthlyPots: 0};

    const weight = parseFloat(pet.weight);
    let dailyCucharadas = 0;

    if (weight <= 5) {
      // Toy
      dailyCucharadas = 2 * weight;
    } else if (pet.age === "1-6 meses" || pet.age === "7-12 meses") {
      if (weight <= 15) {
        // Cachorros (1-15kg)
        dailyCucharadas = weight / 2;
      } else {
        // Cachorros (+15kg)
        dailyCucharadas = weight / 5;
      }
    } else if (pet.age === "+7 años (geronte)") {
      if (weight > 20) {
        // Gerontes (+20kg)
        dailyCucharadas = weight / 5;
      } else {
        // Gerontes normales
        dailyCucharadas = weight / 2;
      }
    } else {
      // Adultos
      dailyCucharadas = weight / 5;
    }

    // Round to nearest 0.5
    dailyCucharadas = Math.round(dailyCucharadas * 2) / 2;

    // Calculate monthly pots (30 cucharadas per pot)
    const daysInMonth = 30;
    const monthlyCucharadas = dailyCucharadas * daysInMonth;
    const monthlyPots = Math.ceil(monthlyCucharadas / 30);

    return {
      dailyDose: dailyCucharadas,
      monthlyPots: monthlyPots,
    };
  };

  const calculateCurcumaActivadaDosage = (pet: Pet) => {
    if (!pet.weight) return {dailyDose: 0, monthlyPots: 0};

    const weight = parseFloat(pet.weight);
    let dailyCucharaditas = 0;

    if (weight < 10) {
      // Less than 10kg
      dailyCucharaditas = 1;
    } else {
      // 1 cucharadita for each 10kg
      dailyCucharaditas = Math.ceil(weight / 10);
    }

    // Calculate monthly pots (10 cucharaditas per pot)
    const daysInMonth = 30;
    const monthlyCucharaditas = dailyCucharaditas * daysInMonth;
    const monthlyPots = Math.ceil(monthlyCucharaditas / 10);

    return {
      dailyDose: dailyCucharaditas,
      monthlyPots: monthlyPots,
    };
  };

  const calculateCalcioDosage = (pet: Pet) => {
    // Only if not eating commercial food (or very little)
    const needsCalcio = commercialFoodPercentage < 10;

    // For natural diets (raw or cooked), always include Calcio
    const isNaturalDiet = pet.dietType === "raw" || pet.dietType === "cooked";

    return {
      recommended: needsCalcio || isNaturalDiet,
      monthlyPots: needsCalcio || isNaturalDiet ? 1 : 0,
      message: isNaturalDiet
        ? "Recomendado para dieta natural (1 pote al mes)"
        : needsCalcio
          ? "Recomendado (1 pote al mes)"
          : "No es necesario si ya consume alimento comercial",
    };
  };


  return {
    prepareAndSendOrder,
    calculateDailyPortion,
    calculateCaldoDosage,
    calculateCurcumaActivadaDosage,
    calculateCalcioDosage,
  };
}
