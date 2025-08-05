import { Calendar, ChevronDown, Euro, MapPin, Star } from "lucide-react";
import type {
  DeliveryMethod,
  NutritionistServiceWithNutritionist,
} from "../types";
import Button from "./Button";
import { useState, useRef, useEffect } from "react";
import Avatar from "./Avatar";
import type { GroupedNutritionistService } from "../types";

type Props = {
  nutritionist_services: GroupedNutritionistService;
  onScheduleAppointment: (service: NutritionistServiceWithNutritionist) => void;
};

const NutritionistCard: React.FC<Props> = ({
  nutritionist_services,
  onScheduleAppointment,
}) => {
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedService: NutritionistServiceWithNutritionist = {
    ...nutritionist_services.services[selectedServiceIndex],
    nutritionist: nutritionist_services.nutritionist,
  };
  const nutritionist = nutritionist_services.nutritionist;
  const deliveryMethodLabels: Record<DeliveryMethod, string> = {
    in_person: "In Person",
    online: "Online",
  } as const;

  const handleServiceSelect = (index: number) => {
    setSelectedServiceIndex(index);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 max-w-4xl mx-auto">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20">
            <Avatar name={nutritionist.name} />
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              {
                <div className="flex items-center space-x-1 bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-sm font-medium">
                  <Star className="w-4 h-4" />
                  <span>FOLLOW-UP</span>
                </div>
              }
            </div>

            <h2 className="text-2xl font-semibold text-emerald-500 mb-1">
              {nutritionist.name}
            </h2>

            <p className="text-gray-500 text-sm mb-4">{nutritionist.title}</p>

            <div className="flex items-start space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" />
              <div className="flex flex-col space-y-2">
                <span className="font-medium text-emerald-500">
                  {deliveryMethodLabels[selectedService.delivery_method]}
                  {" Follow Up"}
                </span>
                <div className="text-gray-600">
                  {selectedService.location.full_address}
                </div>
                <div className="text-gray-600">
                  {selectedService.location.city}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3 w-1/3">
          <Button
            onClick={() => onScheduleAppointment(selectedService)}
            variant="orange-light"
          >
            Schedule appointment
          </Button>

          <Button
            variant="green-light"
            onClick={() => {
              // TODO: Navigate to nutritionist's website
              console.log(`Opening website for ${nutritionist.name}`);
            }}
          >
            Website
          </Button>

          <div
            ref={dropdownRef}
            className="relative pt-4 border-t border-gray-100"
          >
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex flex-col items-start justify-between gap-4 w-full text-gray-600 hover:text-gray-800 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-green-400" />
                <span className="text-sm">{selectedService.service.name}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </div>

              <div className="flex items-center space-x-2 text-gray-600">
                <Euro className="w-4 h-4 text-green-400" />
                <span className="font-semibold">
                  €{selectedService.pricing}
                </span>
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[350px] max-w-[500px]">
                {nutritionist_services.services.map((service, index) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(index)}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${
                      index === selectedServiceIndex
                        ? "bg-emerald-50 text-emerald-600"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className="flex flex-col space-y-1 flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="font-medium truncate">
                            {service.service.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 ml-6">
                          <span>
                            {deliveryMethodLabels[service.delivery_method]}
                          </span>
                          <span>•</span>
                          <span>{service.location.city}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <span className="font-semibold">
                          €{service.pricing}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionistCard;
