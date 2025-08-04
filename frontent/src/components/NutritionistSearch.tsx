import { useState, useEffect, useCallback } from "react";
import type { NutritionistService, ApiResponse } from "../types";
import NutritionistCard from "./NutritionistCard";
import Navbar from "./Navbar";
import Search from "./Search";
import AppointmentModal from "./AppointmentModal";

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

  const API_BASE_URL = "http://localhost:3000";

  const getSortedServices = useCallback((services: NutritionistService[]) => {
    return services.sort((a, b) =>
      a.nutritionist.name.localeCompare(b.nutritionist.name),
    );
  }, []);

  const fetchNutritionists = useCallback(
    async (params?: SearchParams): Promise<void> => {
      setLoading(true);
      try {
        let url = `${API_BASE_URL}/nutritionist_services`;
        const queryParams: string[] = [];

        if (params?.searchTerm) {
          queryParams.push(`search=${encodeURIComponent(params.searchTerm)}`);
        }

        if (params?.location) {
          queryParams.push(`location=${encodeURIComponent(params.location)}`);
        }

        if (queryParams.length > 0) {
          url += `?${queryParams.join("&")}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        setNutritionistServices(getSortedServices(data || []));
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
        <Navbar />

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
        apiBaseUrl={API_BASE_URL}
      />
    </div>
  );
};

export default NutritionistSearch;
