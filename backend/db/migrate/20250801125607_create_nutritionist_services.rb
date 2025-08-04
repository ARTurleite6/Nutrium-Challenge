# frozen_string_literal: true

class CreateNutritionistServices < ActiveRecord::Migration[8.0]
  def change
    create_table :nutritionist_services, id: :uuid do |t|
      t.references :nutritionist, null: false, foreign_key: true, type: :uuid
      t.references :service, null: false, foreign_key: true, type: :uuid
      t.references :location, null: false, foreign_key: true, type: :uuid
      t.decimal :pricing, precision: 8, scale: 2, null: false

      t.timestamps
    end
  end
end
