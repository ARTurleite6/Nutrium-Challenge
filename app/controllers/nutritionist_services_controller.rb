class NutritionistServicesController < ApplicationController
  def index
    @nutritionist_services = if params[:search].present?
                               NutritionistService.search_by_nutritionist_or_service(params[:search])
    else
                               NutritionistService.all
    end
                             .joins(:nutritionist, :service, :location)
                             .select("nutritionist_services.*, nutritionists.name as nutritionist_name, services.name as service_name, locations.id as location_id, locations.city, locations.full_address")

    render json: {
      nutritionist_services: @nutritionist_services.as_json(
        include: {
          nutritionist: { only: [ :id, :name ] },
          service: { only: [ :id, :name ] },
          location: { only: [ :id, :city, :full_address ] }
        },
        only: [ :id, :pricing ]
      )
    }
  end
end
