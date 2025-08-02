class AppointmentsController < ApplicationController
  before_action :set_appointment, only: [ :accept, :refuse ]

  def create
    result = CreateAppointmentService.new(appointment_params).perform
    if result.success?
      render json: result.appointment, serializer: AppointmentSerializer, status: :created
    else
      render json: {
        errors: e.record&.errors&.full_messages
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
    @appointment.update!(state: :accepted)
  end

  def refuse
    result = RejectAppointmentService.new(@appointment).perform

    if result.success?
      render json: result.appointment, serializer: AppointmentSerializer
    else
      render json: { errors: result.errors }, serializer: AppointmentSerializer
    end
  end

  private

  def set_appointment
    @appointment = Appointment.find(params[:id])
  end

  def appointment_params
    params.require(:appointment).permit(
      :guest_name,
      :guest_email,
      :nutritionist_service_id,
      :event_date
    )
  end
end
