class NutritionistsController < ApplicationController
  before_action :set_nutritionist

  def appointments
    appointments = @nutritionist.appointments.includes(:guest)

    render json: appointments, each_serializer: AppointmentSerializer
  end

  def set_nutritionist
    @nutritionist = Nutritionist.find(params[:id])
  end
end
