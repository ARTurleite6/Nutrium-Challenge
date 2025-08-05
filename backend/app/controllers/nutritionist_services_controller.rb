# frozen_string_literal: true

class NutritionistServicesController < ApplicationController
  def index
    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 10).to_i

    # Get filtered services using existing scopes
    filtered_services = NutritionistService.search_by_nutritionist_or_service(params[:search])
                                          .filter_by_location(params[:location])
                                          .includes(:nutritionist, :service, :location)

    # Get unique nutritionist IDs from filtered services - without ordering to avoid PostgreSQL DISTINCT issue
    nutritionist_ids = filtered_services.distinct.pluck(:nutritionist_id)

    # Count for pagination is based on number of nutritionists
    total_count = nutritionist_ids.length
    total_pages = (total_count.to_f / per_page).ceil

    paginated_nutritionist_ids = nutritionist_ids.slice((page - 1) * per_page, per_page) || []

    nutritionists = Nutritionist.where(id: paginated_nutritionist_ids).order(:name)

    nutritionist_services = filtered_services
                              .where(nutritionist_id: paginated_nutritionist_ids)
                              .to_a

    grouped_services = nutritionist_services.group_by(&:nutritionist_id)

    nutritionists_with_services = nutritionists.map do |nutritionist|
      {
        nutritionist: ActiveModelSerializers::SerializableResource.new(
          nutritionist,
          serializer: NutritionistSerializer
        ),
        services: ActiveModelSerializers::SerializableResource.new(
          grouped_services[nutritionist.id] || [],
          each_serializer: NutritionistServiceSerializer
        )
      }
    end

    render json: {
      nutritionists: nutritionists_with_services,
      pagination: {
        current_page: page,
        per_page: per_page,
        total_pages: total_pages,
        total_count: total_count
      }
    }
  end
end
