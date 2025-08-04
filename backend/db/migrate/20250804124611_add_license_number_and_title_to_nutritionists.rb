# frozen_string_literal: true

class AddLicenseNumberAndTitleToNutritionists < ActiveRecord::Migration[8.0]
  def change
    add_column :nutritionists, :license_number, :string, null: false
    add_column :nutritionists, :title, :string, null: false

    add_index :nutritionists, :license_number, unique: true
  end
end
