import React from "react";
import { questions } from "@/lib/questions";
import { evaluateConditions } from "@/lib/conditions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConsentDialog } from "@/components/consent-dialog";

export default function MentalHealthPage() {
  const [answers, setAnswers] = React.useState<Record<number, number>>({});
  const [result, setResult] = React.useState<string | null>(null);
  const [showConsent, setShowConsent] = React.useState(true);

  const handleAnswer = (index: number, score: number) => {
    setAnswers((prev) => ({ ...prev, [index]: score }));
  };

  const handleSubmit = () => {
    const scores = questions.map((_, i) => answers[i] || 0);
    const diagnosis = evaluateConditions(scores);
    setResult(diagnosis);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {showConsent && <ConsentDialog onAccept={() => setShowConsent(false)} />}

      {!showConsent && (
        <>
          <h1 className="text-2xl font-bold mb-4">Autoevaluación de Salud Mental</h1>
          {questions.map((q, index) => (
            <Card key={index} className="mb-4">
              <CardContent>
                <p className="font-semibold mb-2">{q.question}</p>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((score) => (
                    <Button
                      key={score}
                      variant={answers[index] === score ? "default" : "outline"}
                      onClick={() => handleAnswer(index, score)}
                    >
                      {score}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <Button onClick={handleSubmit} className="mt-4">Enviar</Button>

          {result && (
            <div className="mt-6 p-4 border rounded-xl bg-gray-50 shadow">
              <h2 className="text-xl font-semibold">Resultado</h2>
              <p>{result}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// =====================
// lib/questions.ts
// =====================

export const questions = [
  { question: "¿Con qué frecuencia te has sentido triste en los últimos 7 días?" },
  { question: "¿Has tenido problemas para dormir o permanecer dormido/a?" },
  { question: "¿Has sentido que las cosas que solías disfrutar ya no te interesan?" },
  { question: "¿Con qué frecuencia has tenido pensamientos negativos sobre ti mismo/a?" },
  { question: "¿Has tenido dificultad para concentrarte en tus tareas diarias?" }
];
