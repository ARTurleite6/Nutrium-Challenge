# frozen_string_literal: true

class NutritionistsController < ApplicationController
  before_action :set_nutritionist

  def appointments
    page = params.fetch(:page, 1).to_i
    per_page = params.fetch(:per_page, 10).to_i

    appointments = @nutritionist.appointments.where(state: :pending).includes(:guest,
                                                                              nutritionist_service: %i[nutritionist
                                                                                                       service location])
                                                                    .limit(per_page)
                                                                    .offset((page - 1) * per_page)

    total_count = @nutritionist.appointments.where(state: :pending).count
    total_pages = (total_count.to_f / per_page).ceil

    render json: {
      appointments: ActiveModelSerializers::SerializableResource.new(
        appointments,
        each_serializer: AppointmentSerializer,
        include: ['guest', 'nutritionist_service', 'nutritionist_service.service', 'nutritionist_service.nutritionist', 'nutritionist_service.location']
      ),
      pagination: {
        current_page: page,
        per_page: per_page,
        total_count: total_count,
        total_pages: total_pages
      }
    }
  end

  def set_nutritionist
    @nutritionist = Nutritionist.find(params[:id])
  end
end
