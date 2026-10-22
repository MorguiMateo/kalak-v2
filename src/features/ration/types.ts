export type Species = "dog" | "cat";
export type Gender = "male" | "female";
export type AgeGroup = "1-6 meses" | "7-12 meses" | "1-6 años" | "+7 años (geronte)";
export type BodyCondition = "delgado" | "normal" | "sobrepeso";
export type Activity = "bajo" | "normal" | "alto";
/** raw/cooked: 100% Kalak · mixed: 60% Kalak + 40% commercial · supplements: commercial + supplements. */
export type Diet = "raw" | "cooked" | "mixed" | "supplements";
export type Supplement = "caldo" | "curcuma" | "calcio";

export type Pet = {
  name: string;
  species: Species;
  gender: Gender;
  breed: string;
  age: AgeGroup;
  sterilized: boolean;
  /** Kilograms. */
  weight: number;
  bodyCondition: BodyCondition;
  activity: Activity;
  diet: Diet;
  supplements: readonly Supplement[];
};

export type DurationChoice = "1_week" | "2_weeks" | "1_month" | "custom";

export type Customer = { name: string; phone: string };
