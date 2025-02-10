import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PricingCard } from "./PricingCard";
import { createPreference } from "@/lib/mercadopago";

const plans = [
  {
    id: "monthly",
    title: "Plan Mensual",
    price: 5.99,
    interval: "mes",
    description: "Acceso completo por un mes",
    features: [
      "Acceso ilimitado a todas las frases",
      "Sin límite diario",
      "Todas las categorías disponibles",
      "Soporte prioritario"
    ]
  },
  {
    id: "biannual",
    title: "Plan Semestral",
    price: 29.99,
    interval: "6 meses",
    description: "Ahorra con 6 meses de acceso",
    features: [
      "Todo lo del plan mensual",
      "Ahorro del 17%",
      "Acceso a contenido exclusivo",
      "Descarga de recursos"
    ]
  },
  {
    id: "annual",
    title: "Plan Anual",
    price: 49.99,
    interval: "año",
    description: "La mejor relación calidad-precio",
    features: [
      "Todo lo del plan semestral",
      "Ahorro del 31%",
      "Contenido premium exclusivo",
      "Características beta anticipadas"
    ]
  }
];

export function PricingPlans() {
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    try {
      setLoadingPlan(planId);

      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (!token || !user) {
        console.error("No hay token o usuario en localStorage");
        throw new Error("Debes iniciar sesión para suscribirte");
      }

      console.log("Usuario autenticado:", JSON.parse(user));

      const selectedPlan = plans.find(plan => plan.id === planId);
      if (!selectedPlan) {
        throw new Error("Plan no encontrado");
      }

      console.log("Creando preferencia para el plan:", selectedPlan);
      const initPoint = await createPreference(selectedPlan.title, selectedPlan.price);
      
      if (!initPoint) {
        throw new Error("Error al crear la preferencia de pago");
      }

      console.log("Abriendo ventana de pago:", initPoint);
      window.open(initPoint, '_blank', 'width=1000,height=800');

    } catch (error) {
      console.error('Error en suscripción:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al procesar la suscripción",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            title={plan.title}
            price={plan.price}
            interval={plan.interval}
            description={plan.description}
            features={plan.features}
            onSubscribe={() => handleSubscribe(plan.id)}
            isLoading={loadingPlan === plan.id}
          />
        ))}
      </div>
    </div>
  );
}