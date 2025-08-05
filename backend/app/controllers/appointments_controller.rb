# frozen_string_literal: true

class AppointmentsController < ApplicationController
  before_action :set_appointment, only: %i[accept reject]

  def create
    result = CreateAppointmentService.new(appointment_params).perform
    if result.success?
      render json: result.appointment, serializer: AppointmentSerializer, status: :created
    else
      render json: {
        errors: result.errors
      }, status: :unprocessable_content
    end
  end

  def accept
    result = AcceptAppointmentService.new(@appointment).perform

    if result.success?
      render json: result.appointment, serializer: AppointmentSerializer
    else
      render json: { errors: result.errors }, serializer: AppointmentSerializer
    end
  end

  def reject
    result = RejectAppointmentService.new(@appointment).perform

    if result.success?
      render json: result.appointment, serializer: AppointmentSerializer
    else
      render json: { errors: result.errors }, serializer: AppointmentSerializer
    end
  end

  private

  def set_appointment
    @appointment = Appointment.find(params[:appointment_id])
  end

  def appointment_params
    params.require(:appointment).permit(
      :nutritionist_service_id,
      :event_date,
      guest_attributes: %i[name email]
    )
  end
end
