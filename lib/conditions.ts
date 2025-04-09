export function evaluateConditions(scores: number[]): string {
  const total = scores.reduce((sum, val) => sum + val, 0);

  if (total >= 12) return "Es posible que estés experimentando síntomas de depresión moderada a severa.";
  if (total >= 8) return "Podrías estar mostrando signos de depresión leve.";
  return "Tus respuestas no indican signos evidentes de depresión, pero si tienes dudas, consulta con un profesional.";
}
