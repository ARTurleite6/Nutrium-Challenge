import { useState, useEffect, useCallback } from "react";
import { MapPin, Calendar, User } from "lucide-react";
import AppointmentModal from "./AppointmentModal";
import type { NutritionistService, ApiResponse } from "../types";

const NutritionistSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
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
    async (search: string = ""): Promise<void> => {
      setLoading(true);
      try {
        const url = search
          ? `${API_BASE_URL}/nutritionist_services?search=${encodeURIComponent(search)}`
          : `${API_BASE_URL}/nutritionist_services`;

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

  const handleSearch = useCallback((): void => {
    fetchNutritionists(searchTerm);
  }, [searchTerm, fetchNutritionists]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch],
  );

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

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <div className="bg-green-500 text-white w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl font-bold">🥗 nutrium</div>
            </div>
            <div className="text-base hidden lg:block">
              Are you a nutrition professional? Get to know our software →
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Name, service, online appointment"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-6 py-4 text-lg rounded-lg text-gray-800 focus:outline-none focus:ring-3 focus:ring-green-300 bg-white shadow-sm"
              />
            </div>
            <div className="relative min-w-[180px]">
              <select
                className="w-full px-6 py-4 text-lg rounded-lg text-gray-800 focus:outline-none focus:ring-3 focus:ring-green-300 bg-white appearance-none pr-12 shadow-sm"
                onChange={(e) =>
                  console.log("Location selected:", e.target.value)
                }
              >
                <option>Location</option>
                <option>Lisboa</option>
                <option>Porto</option>
                <option>Coimbra</option>
              </select>
              <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500 pointer-events-none" />
            </div>
            <button
              onClick={handleSearch}
              className="bg-orange-400 hover:bg-orange-600 px-8 py-4 text-lg rounded-lg font-medium transition-colors shadow-sm min-w-[120px]"
            >
              Search
            </button>
          </div>
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
        ) : (
          <div className="space-y-8">
            {(() => {
              const groupedServices: { [key: string]: NutritionistService[] } =
                {};

              nutritionistServices.forEach((service) => {
                if (!groupedServices[service.nutritionist.id]) {
                  groupedServices[service.nutritionist.id] = [];
                }
                groupedServices[service.nutritionist.id].push(service);
              });

              return Object.entries(groupedServices).map(
                ([nutritionistId, services], groupIndex) => (
                  <div key={nutritionistId}>
                    {groupIndex > 0 && (
                      <div className="border-b border-gray-200 my-8"></div>
                    )}
                    <div className="mb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          {services[0].nutritionist.name}
                        </h2>
                      </div>
                      <p className="text-gray-600">Available Services:</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                        >
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-6 h-6 text-orange-400" />
                              </div>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                ✓ AVAILABLE
                              </span>
                            </div>

                            <h4 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                              {service.service.name}
                            </h4>

                            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span>{service.location.city}</span>
                            </div>

                            <div className="text-center mb-4">
                              <div className="text-2xl font-bold text-green-600">
                                €{service.pricing}
                              </div>
                            </div>

                            <div className="space-y-3">
                              <button
                                onClick={() => openAppointmentModal(service)}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors text-sm flex items-center justify-center space-x-2 border-0"
                              >
                                <Calendar className="w-4 h-4" />
                                <span>Schedule</span>
                              </button>
                              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors text-sm border-0">
                                Personal Page
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              );
            })()}
          </div>
        )}

        {!loading && nutritionistServices.length === 0 && (
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
