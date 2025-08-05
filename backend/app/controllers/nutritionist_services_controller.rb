# frozen_string_literal: true

class NutritionistServicesController < ApplicationController
  def index
    nutritionist_services = NutritionistService.search_by_nutritionist_or_service(params[:search])
                                               .filter_by_location(params[:location])
                                               .includes(:nutritionist, :service, :location)
    render json: nutritionist_services, each_serializer: NutritionistServiceSerializer
  end
end
