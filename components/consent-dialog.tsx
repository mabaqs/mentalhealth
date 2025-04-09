import { Button } from "@/components/ui/button";

export function ConsentDialog({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md">
        <h2 className="text-xl font-semibold mb-2">Consentimiento Informado</h2>
        <p className="mb-4">
          Esta autoevaluación no reemplaza un diagnóstico profesional. Si estás atravesando una situación difícil, consultá con un especialista.
        </p>
        <Button onClick={onAccept}>Aceptar</Button>
      </div>
    </div>
  );
}
