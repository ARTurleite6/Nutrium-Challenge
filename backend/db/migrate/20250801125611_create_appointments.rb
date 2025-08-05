# frozen_string_literal: true

class CreateAppointments < ActiveRecord::Migration[8.0]
  def change
    create_table :appointments, id: :uuid do |t|
      t.references :guest, null: false, foreign_key: true, type: :uuid
      t.references :nutritionist_service, null: false, foreign_key: true, type: :uuid
      t.integer :state, default: 0, null: false
      t.datetime :event_date, null: false

      t.timestamps
    end

    add_index :appointments, :guest_id, where: 'state = 0', unique: true, name: 'idx_one_pending_per_guest'
    add_index :appointments, :state
    add_index :appointments, :event_date
  end
end
