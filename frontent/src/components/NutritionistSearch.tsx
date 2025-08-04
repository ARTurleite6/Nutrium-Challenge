import { useState, useEffect, useCallback } from "react";
import type { NutritionistService } from "../types";
import NutritionistCard from "./NutritionistCard";
import Search from "./Search";
import AppointmentModal from "./AppointmentModal";
import { getNutritionistServices } from "../api/nutritionist_services";

type SearchParams = {
  searchTerm: string;
  location: string;
};

const NutritionistSearch: React.FC = () => {
  const [nutritionistServices, setNutritionistServices] = useState<
    NutritionistService[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedNutritionist, setSelectedNutritionist] =
    useState<NutritionistService | null>(null);

  const getSortedServices = useCallback((services: NutritionistService[]) => {
    return services.sort((a, b) =>
      a.nutritionist.name.localeCompare(b.nutritionist.name),
    );
  }, []);

  const fetchNutritionists = useCallback(
    async (params?: SearchParams): Promise<void> => {
      setLoading(true);
      try {
        const response = await getNutritionistServices(
          params?.searchTerm,
          params?.location,
        );

        setNutritionistServices(getSortedServices(response || []));
      } catch (error) {
        console.error("Error fetching nutritionists:", error);
        setNutritionistServices([]);
      } finally {
        setLoading(false);
      }
    },
    [getSortedServices],
  );

  useEffect(() => {
    fetchNutritionists();
  }, [fetchNutritionists]);

  const openAppointmentModal = (
    nutritionistService: NutritionistService,
  ): void => {
    setSelectedNutritionist(nutritionistService);
    setShowModal(true);
  };

  const closeModal = (): void => {
    setShowModal(false);
    setSelectedNutritionist(null);
  };

  // Group services by nutritionist
  const groupedServices: { [key: string]: NutritionistService[] } = {};
  nutritionistServices.forEach((service) => {
    if (!groupedServices[service.nutritionist.id]) {
      groupedServices[service.nutritionist.id] = [];
    }
    groupedServices[service.nutritionist.id].push(service);
  });

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <div className="w-full">
        {/* Search Section */}
        <div className="w-full">
          <Search onSearch={fetchNutritionists} />
        </div>
      </div>

      {/* Results */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto"></div>
            <p className="mt-6 text-lg text-gray-600">
              Loading nutritionists...
            </p>
          </div>
        ) : Object.keys(groupedServices).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedServices).map(
              ([nutritionistId, services]) => (
                <NutritionistCard
                  key={nutritionistId}
                  nutritionist_services={services}
                  onScheduleAppointment={openAppointmentModal}
                />
              ),
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No nutritionists found
            </h3>
            <p className="text-gray-600">
              Try a different search term or browse all available nutritionists.
            </p>
          </div>
        )}
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={showModal}
        onClose={closeModal}
        selectedNutritionist={selectedNutritionist}
      />
    </div>
  );
};

export default NutritionistSearch;
