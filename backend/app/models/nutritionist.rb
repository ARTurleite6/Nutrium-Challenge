# frozen_string_literal: true

class Nutritionist < ApplicationRecord
  has_many :nutritionist_services, dependent: :destroy
  has_many :services, through: :nutritionist_services
  has_many :appointments, through: :nutritionist_services

  validates :name, :title, presence: true
  validates :license_number, presence: true, uniqueness: { case_sensitive: true }
end
