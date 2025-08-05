class NutritionistServicesController < ApplicationController
  def index
    nutritionist_services = if params[:search].present?
                               NutritionistService.search_by_nutritionist_or_service(params[:search])
    else
                               NutritionistService.all
    end
                             .includes(:nutritionist, :service, :location)
    render json: nutritionist_services, each_serializer: NutritionistServiceSerializer
  end
end
