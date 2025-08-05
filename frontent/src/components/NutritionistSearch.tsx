import { useState, useEffect, useCallback } from "react";
import type {
  GroupedNutritionistService,
  NutritionistServiceWithNutritionist,
} from "../types";

import NutritionistCard from "./NutritionistCard";
import Search from "./Search";
import AppointmentModal from "./AppointmentModal";
import { getNutritionistServices } from "../api/nutritionist_services";
import Pagination from "./Pagination";

type SearchParams = {
  searchTerm: string;
  location: string;
};

const NutritionistSearch: React.FC = () => {
  const [nutritionistServices, setNutritionistServices] = useState<
    GroupedNutritionistService[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedNutritionist, setSelectedNutritionist] =
    useState<NutritionistServiceWithNutritionist | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [perPage] = useState<number>(10);
  const [searchParams, setSearchParams] = useState<SearchParams | undefined>(
    undefined,
  );

  const fetchNutritionists = useCallback(
    async (params?: SearchParams): Promise<void> => {
      setLoading(true);
      if (params) {
        setSearchParams(params);
        setCurrentPage(1);
      }

      try {
        const currentParams = params || searchParams;
        const response = await getNutritionistServices(
          currentParams?.searchTerm,
          currentParams?.location,
          params ? 1 : currentPage,
          perPage,
        );

        setNutritionistServices(response.nutritionists || []);
        setTotalPages(response.pagination.total_pages);
        setCurrentPage(response.pagination.current_page);
      } catch (error) {
        console.error("Error fetching nutritionists:", error);
        setNutritionistServices([]);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, perPage, searchParams],
  );

  useEffect(() => {
    fetchNutritionists();
  }, [currentPage, fetchNutritionists]);

  const openAppointmentModal = (
    nutritionistService: NutritionistServiceWithNutritionist,
  ): void => {
    setSelectedNutritionist(nutritionistService);
    setShowModal(true);
  };

  const closeModal = (): void => {
    setShowModal(false);
    setSelectedNutritionist(null);
  };

  const handlePageChange = (page: number): void => {
    if (page !== currentPage) {
      window.scrollTo(0, 0);
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full">
        <div className="w-full">
          <Search onSearch={fetchNutritionists} />
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto"></div>
            <p className="mt-6 text-lg text-gray-600">
              Loading nutritionists...
            </p>
          </div>
        ) : nutritionistServices.length > 0 ? (
          <div className="space-y-8">
            {nutritionistServices.map((nutritionist_services) => (
              <NutritionistCard
                key={nutritionist_services.nutritionist.id}
                nutritionist_services={nutritionist_services}
                onScheduleAppointment={openAppointmentModal}
              />
            ))}
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

        {totalPages > 1 && !loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            disabled={loading}
          />
        )}
      </div>

      <AppointmentModal
        isOpen={showModal}
        onClose={closeModal}
        selectedNutritionist={selectedNutritionist}
      />
    </div>
  );
};

export default NutritionistSearch;
