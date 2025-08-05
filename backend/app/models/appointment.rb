class Appointment < ApplicationRecord
  belongs_to :guest
  belongs_to :nutritionist_service

  enum :state, { pending: 0, accepted: 1, rejected: 2 }

  validates :event_date, presence: true
  validate :future_appointment
  validate :one_pending_per_guest, on: :create

  scope :for_nutritionist, ->(nutritionist_id) {
    joins(:nutritionist_service).where(nutritionist_service: { nutritionist_id: nutritionist_id })
  }

  after_update :reject_conflicting_appointments, if: :saved_change_to_state_and_accepted?

  private

  def future_appointment
    errors.add(:event_date, "must be in the future") if event_date&.past?
  end

  # TODO: check if this makes sense in the future(should be this or an error)
  def one_pending_per_guest
    if guest.appointments.pending.exists?
      guest.appointments.pending.update_all(state: :rejected)
    end
  end

  def reject_conflicting_appointments
    nutritionist_service.appointments
      .where(event_date: event_date)
      .where.not(id: id)
      .pending
      .update_all(state: :rejected)
  end

  def saved_change_to_state_and_accepted?
    saved_change_to_state? && accepted?
  end
end
