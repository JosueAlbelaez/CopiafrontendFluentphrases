
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PricingCard } from "./PricingCard";
import { createPreference } from "@/lib/mercadopago";
import { supabase } from "@/lib/supabase";

const plans = [
  {
    id: "monthly",
    title: "Plan Mensual",
    price: 6,
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
    price: 30,
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
    price: 50,
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
      
      // Verificar la sesión del usuario de manera más robusta
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(sessionError.message);
      }

      if (!sessionData.session) {
        throw new Error("Debes iniciar sesión para suscribirte");
      }

      // Verificar que tenemos el usuario activo
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("No se pudo verificar el usuario");
      }

      console.log("Usuario verificado:", user.email); // Debug log

      const selectedPlan = plans.find(plan => plan.id === planId);
      if (!selectedPlan) {
        throw new Error("Plan no encontrado");
      }

      const initPoint = await createPreference(selectedPlan.title, selectedPlan.price);
      
      if (!initPoint) {
        throw new Error("Error al crear la preferencia de pago");
      }

      console.log("Punto de inicio de pago creado:", initPoint); // Debug log
      window.location.href = initPoint;

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
