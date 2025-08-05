# frozen_string_literal: true

class NutritionistServicesController < ApplicationController
  def index
    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 10).to_i

    nutritionist_services = NutritionistService.search_by_nutritionist_or_service(params[:search])
                                               .filter_by_location(params[:location])
                                               .includes(:nutritionist, :service, :location)
                                               .order(created_at: :desc)

    total_count = nutritionist_services.count
    total_pages = (total_count.to_f / per_page).ceil

    nutritionist_services = nutritionist_services.offset((page - 1) * per_page).limit(per_page)

    render json: {
      nutritionist_services: ActiveModelSerializers::SerializableResource.new(
        nutritionist_services,
        each_serializer: NutritionistServiceSerializer
      ),
      pagination: {
        current_page: page,
        per_page: per_page,
        total_pages: total_pages,
        total_count: total_count
      }
    }
  end
end
