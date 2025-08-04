# frozen_string_literal: true

# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 20_250_804_124_611) do
  # These are extensions that must be enabled in order to support this database
  enable_extension 'pg_catalog.plpgsql'
  enable_extension 'pgcrypto'

  create_table 'appointments', id: :uuid, default: -> { 'gen_random_uuid()' }, force: :cascade do |t|
    t.uuid 'guest_id', null: false
    t.uuid 'nutritionist_service_id', null: false
    t.integer 'state', default: 0, null: false
    t.datetime 'event_date', null: false
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['event_date'], name: 'index_appointments_on_event_date'
    t.index ['guest_id'], name: 'idx_one_pending_per_guest', unique: true, where: '(state = 0)'
    t.index ['guest_id'], name: 'index_appointments_on_guest_id'
    t.index ['nutritionist_service_id'], name: 'index_appointments_on_nutritionist_service_id'
    t.index ['state'], name: 'index_appointments_on_state'
  end

  create_table 'guests', id: :uuid, default: -> { 'gen_random_uuid()' }, force: :cascade do |t|
    t.string 'name'
    t.string 'email'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
  end

  create_table 'locations', id: :uuid, default: -> { 'gen_random_uuid()' }, force: :cascade do |t|
    t.text 'full_address'
    t.string 'city'
    t.point 'coordinates'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
  end

  create_table 'nutritionist_services', id: :uuid, default: -> { 'gen_random_uuid()' }, force: :cascade do |t|
    t.uuid 'nutritionist_id', null: false
    t.uuid 'service_id', null: false
    t.uuid 'location_id', null: false
    t.decimal 'pricing', precision: 8, scale: 2, null: false
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.integer 'delivery_method', default: 0, null: false
    t.integer 'appointment_type', default: 0, null: false
    t.index ['appointment_type'], name: 'index_nutritionist_services_on_appointment_type'
    t.index ['delivery_method'], name: 'index_nutritionist_services_on_delivery_method'
    t.index ['location_id'], name: 'index_nutritionist_services_on_location_id'
    t.index ['nutritionist_id'], name: 'index_nutritionist_services_on_nutritionist_id'
    t.index ['service_id'], name: 'index_nutritionist_services_on_service_id'
  end

  create_table 'nutritionists', id: :uuid, default: -> { 'gen_random_uuid()' }, force: :cascade do |t|
    t.string 'name', null: false
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.string 'license_number', null: false
    t.string 'title', null: false
    t.index ['license_number'], name: 'index_nutritionists_on_license_number', unique: true
    t.index ['name'], name: 'index_nutritionists_on_name'
  end

  create_table 'services', id: :uuid, default: -> { 'gen_random_uuid()' }, force: :cascade do |t|
    t.string 'name'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
  end

  add_foreign_key 'appointments', 'guests'
  add_foreign_key 'appointments', 'nutritionist_services'
  add_foreign_key 'nutritionist_services', 'locations'
  add_foreign_key 'nutritionist_services', 'nutritionists'
  add_foreign_key 'nutritionist_services', 'services'
end
