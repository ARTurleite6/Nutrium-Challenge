# frozen_string_literal: true

class Appointment < ApplicationRecord
  belongs_to :guest
  belongs_to :nutritionist_service

  accepts_nested_attributes_for :guest

  enum :state, { pending: 0, accepted: 1, rejected: 2 }

  validates :event_date, presence: true
  validate :future_appointment

  scope :for_nutritionist, lambda { |nutritionist_id|
    joins(:nutritionist_service).where(nutritionist_service: { nutritionist_id: nutritionist_id })
  }

  after_update :reject_conflicting_appointments, if: :saved_change_to_state_and_accepted?

  private

  def future_appointment
    errors.add(:event_date, 'must be in the future') if event_date&.past?
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
