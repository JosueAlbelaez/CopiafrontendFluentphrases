
import { PricingPlans } from "@/components/subscription/PricingPlans";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Nuestros Planes
          </h1>
          <p className="mt-5 text-xl text-gray-500 dark:text-gray-300">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>
        <PricingPlans />
      </div>
    </div>
  );
}
