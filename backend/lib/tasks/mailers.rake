# frozen_string_literal: true

namespace :mailers do
  desc 'Send a test email'
  task :test, %i[email_type appointment_id] => :environment do |_, args|
    email_type = args[:email_type] || 'confirmation'
    appointment_id = args[:appointment_id]

    unless appointment_id
      # Find a random accepted appointment if none specified
      appointment_id = Appointment.accepted.order('RANDOM()').first&.id

      unless appointment_id
        puts 'ERROR: No accepted appointments found and no appointment_id provided.'
        puts 'Please create an appointment or specify an appointment_id.'
        exit 1
      end
    end

    begin
      appointment = Appointment.find(appointment_id)

      case email_type
      when 'accepted'
        puts "Sending 'accepted' email for appointment ##{appointment_id}..."
        AppointmentMailer.appointment_accepted(appointment).deliver_now
      when 'rejected'
        puts "Sending 'rejected' email for appointment ##{appointment_id}..."
        AppointmentMailer.appointment_rejected(appointment).deliver_now
      when 'confirmation'
        puts "Sending 'confirmation' email for appointment ##{appointment_id}..."
        AppointmentMailer.appointment_confirmation(appointment).deliver_now
      else
        puts "ERROR: Unknown email type '#{email_type}'"
        puts 'Valid options: accepted, rejected, confirmation'
        exit 1
      end

      puts 'Email sent successfully!'
      puts 'Check your letter_opener interface or tmp/letter_opener directory'
    rescue ActiveRecord::RecordNotFound
      puts "ERROR: Appointment ##{appointment_id} not found."
      exit 1
    rescue StandardError => e
      puts "ERROR: #{e.message}"
      puts e.backtrace.join("\n")
      exit 1
    end
  end

  desc 'List all available appointments'
  task list_appointments: :environment do
    appointments = Appointment.includes(nutritionist_service: %i[nutritionist
                                                                 service]).order(created_at: :desc).limit(10)

    if appointments.any?
      puts 'Latest 10 appointments:'
      puts 'ID | State | Date | Guest | Nutritionist | Service'
      puts '-' * 80

      appointments.each do |a|
        puts "#{a.id} | #{a.state} | #{a.event_date.strftime('%Y-%m-%d %H:%M')} | #{a.guest.name} | #{a.nutritionist_service.nutritionist.name} | #{a.nutritionist_service.service.name}"
      end
    else
      puts 'No appointments found.'
    end
  end
end
