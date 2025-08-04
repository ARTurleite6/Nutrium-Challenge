# frozen_string_literal: true

class AddDeliveryMethodAndAppointmentTypeToNutritionistServices < ActiveRecord::Migration[8.0]
  def change
    add_column :nutritionist_services, :delivery_method, :integer, default: 0, null: false

    add_index :nutritionist_services, :delivery_method
  end
end
