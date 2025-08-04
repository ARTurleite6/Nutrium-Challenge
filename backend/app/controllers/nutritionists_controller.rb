# frozen_string_literal: true

class NutritionistsController < ApplicationController
  before_action :set_nutritionist

  def appointments
    appointments = @nutritionist.appointments.where(state: :pending).includes(:guest, nutritionist_service: %i[nutritionist service location])

    render json: appointments, each_serializer: AppointmentSerializer, include: ['guest', 'nutritionist_service', 'nutritionist_service.service', 'nutritionist_service.nutritionist', 'nutritionist_service.location']
  end

  def set_nutritionist
    @nutritionist = Nutritionist.find(params[:id])
  end
end
