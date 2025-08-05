# frozen_string_literal: true

# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

locations = [
  {
    full_address: 'Rua Augusta 123, 1100-048 Lisboa',
    city: 'Lisboa',
    coordinates: [-9.1393, 38.7223]
  },
  {
    full_address: 'Avenida da Liberdade 456, 1250-096 Lisboa',
    city: 'Lisboa',
    coordinates: [-9.1480, 38.7169]
  },
  {
    full_address: 'Rua de Santa Catarina 789, 4000-447 Porto',
    city: 'Porto',
    coordinates: [-8.6291, 41.1579]
  },
  {
    full_address: 'Praça da República 321, 4000-322 Porto',
    city: 'Porto',
    coordinates: [-8.6100, 41.1496]
  },
  {
    full_address: 'Avenida Central 654, 3000-045 Coimbra',
    city: 'Coimbra',
    coordinates: [-8.4103, 40.2033]
  },
  {
    full_address: 'Rua Dr. Francisco Sá Carneiro 987, 4710-057 Braga',
    city: 'Braga',
    coordinates: [-8.4261, 41.5454]
  },
  {
    full_address: 'Avenida de Roma 147, 1000-265 Lisboa',
    city: 'Lisboa',
    coordinates: [-9.1394, 38.7515]
  },
  {
    full_address: 'Rua Miguel Bombarda 258, 4050-377 Porto',
    city: 'Porto',
    coordinates: [-8.6200, 41.1621]
  }
]

created_locations = locations.map do |location_data|
  Location.find_or_create_by(full_address: location_data[:full_address]) do |location|
    location.city = location_data[:city]
    location.coordinates = location_data[:coordinates]
  end
end

services_data = [
  'Weight Loss Consultation',
  'Sports Nutrition',
  'Meal Planning',
  'Diabetes Management',
  'Heart-Healthy Diet',
  'Vegetarian/Vegan Nutrition',
  'Child Nutrition',
  'Senior Nutrition',
  'Eating Disorder Support',
  'Pregnancy Nutrition',
  'Food Allergy Management',
  'Digestive Health'
]

created_services = services_data.map do |service_name|
  Service.find_or_create_by!(name: service_name)
end

# Updated nutritionists data with license numbers and titles
nutritionists_data = [
  { name: 'Dr. Maria Silva', license_number: '2963N', title: 'Dietitian' },
  { name: 'Dr. João Santos', license_number: '1847N', title: 'Sports Nutritionist' },
  { name: 'Dr. Ana Costa', license_number: '3291N', title: 'Clinical Nutritionist' },
  { name: 'Dr. Pedro Oliveira', license_number: '4152N', title: 'Pediatric Nutritionist' },
  { name: 'Dr. Catarina Ferreira', license_number: '2785N', title: 'Dietitian' },
  { name: 'Dr. Miguel Rodrigues', license_number: '3947N', title: 'Sports Nutritionist' },
  { name: 'Dr. Sofia Martins', license_number: '1632N', title: 'Clinical Nutritionist' },
  { name: 'Dr. Ricardo Pereira', license_number: '5284N', title: 'Nutritionist' },
  { name: 'Dr. Beatriz Gomes', license_number: '2974N', title: 'Registered Dietitian' },
  { name: 'Dr. Tiago Almeida', license_number: '4157N', title: 'Sports Nutritionist' },
  { name: 'Dr. Inês Carvalho', license_number: '3628N', title: 'Clinical Nutritionist' },
  { name: 'Dr. Nuno Ribeiro', license_number: '1893N', title: 'Nutritionist' }
]

created_nutritionists = nutritionists_data.map do |nutritionist_data|
  Nutritionist.find_or_create_by(name: nutritionist_data[:name]) do |nutritionist|
    nutritionist.license_number = nutritionist_data[:license_number]
    nutritionist.title = nutritionist_data[:title]
  end
end

created_nutritionists.each do |nutritionist|
  # Each nutritionist offers 2-4 services
  services_count = rand(2..4)
  selected_services = created_services.sample(services_count)

  selected_services.each do |service|
    # Each service can be offered at 1-2 locations for in-person
    locations_count = rand(1..2)
    selected_locations = created_locations.sample(locations_count)

    # Generate delivery methods and appointment types combinations
    delivery_methods = %i[in_person online]
    delivery_methods.each do |delivery_method|
      # For online services, we don't need multiple locations
      locations_to_use = delivery_method == :online ? [selected_locations.first] : selected_locations

      locations_to_use.each do |location|
        # Skip if this combination already exists
        next if NutritionistService.exists?(
          nutritionist: nutritionist,
          service: service,
          location: location,
          delivery_method: delivery_method
        )

        # Generate realistic pricing based on service type and appointment type
        base_price = case service.name
                     when 'Weight Loss Consultation' then rand(50..80)
                     when 'Sports Nutrition' then rand(60..90)
                     when 'Meal Planning' then rand(40..70)
                     when 'Diabetes Management' then rand(70..100)
                     when 'Heart-Healthy Diet' then rand(65..95)
                     when 'Vegetarian/Vegan Nutrition' then rand(45..75)
                     when 'Child Nutrition' then rand(55..85)
                     when 'Senior Nutrition' then rand(50..80)
                     when 'Eating Disorder Support' then rand(80..120)
                     when 'Pregnancy Nutrition' then rand(60..90)
                     when 'Food Allergy Management' then rand(70..100)
                     when 'Digestive Health' then rand(65..95)
                     else rand(50..80)
                     end

        # Adjust pricing based on delivery method and appointment type
        price_multiplier = 1.0
        price_multiplier *= 0.8 if delivery_method == :online # Online is usually cheaper
        price_multiplier *= 1.2 if delivery_method == :in_person # In-person is more expensive

        final_price = (base_price * price_multiplier + rand(-5..15)).round(2)

        NutritionistService.create!(
          nutritionist: nutritionist,
          service: service,
          location: location,
          delivery_method: delivery_method,
          pricing: final_price
        )
      end
    end
  end
end

puts 'Seeded:'
puts "- #{Location.count} locations"
puts "- #{Service.count} services"
puts "- #{Nutritionist.count} nutritionists"
puts "- #{NutritionistService.count} nutritionist services"
