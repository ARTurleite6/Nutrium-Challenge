# frozen_string_literal: true

class CreateLocations < ActiveRecord::Migration[8.0]
  def change
    create_table :locations, id: :uuid do |t|
      t.text :full_address, null: false
      t.string :city, null: false
      t.point :coordinates, null: false

      t.timestamps
    end

    add_index :locations, :city
    add_index :locations, :coordinates, using: :gist
  end
end
