class Service < ApplicationRecord
  has_many :nutritionist_services, dependent: :destroy

  validates :name, presence: true
end
