# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

locations = [
  {
    full_address: "Rua Augusta 123, 1100-048 Lisboa",
    city: "Lisboa",
    coordinates: [ -9.1393, 38.7223 ]
  },
  {
    full_address: "Avenida da Liberdade 456, 1250-096 Lisboa",
    city: "Lisboa",
    coordinates: [ -9.1480, 38.7169 ]
  },
  {
    full_address: "Rua de Santa Catarina 789, 4000-447 Porto",
    city: "Porto",
    coordinates: [ -8.6291, 41.1579 ]
  },
  {
    full_address: "Praça da República 321, 4000-322 Porto",
    city: "Porto",
    coordinates: [ -8.6100, 41.1496 ]
  },
  {
    full_address: "Avenida Central 654, 3000-045 Coimbra",
    city: "Coimbra",
    coordinates: [ -8.4103, 40.2033 ]
  },
  {
    full_address: "Rua Dr. Francisco Sá Carneiro 987, 4710-057 Braga",
    city: "Braga",
    coordinates: [ -8.4261, 41.5454 ]
  },
  {
    full_address: "Avenida de Roma 147, 1000-265 Lisboa",
    city: "Lisboa",
    coordinates: [ -9.1394, 38.7515 ]
  },
  {
    full_address: "Rua Miguel Bombarda 258, 4050-377 Porto",
    city: "Porto",
    coordinates: [ -8.6200, 41.1621 ]
  }
]

created_locations = locations.map do |location_data|
  Location.find_or_create_by(full_address: location_data[:full_address]) do |location|
    location.city = location_data[:city]
    location.coordinates = location_data[:coordinates]
  end
end

services_data = [
  "Weight Loss Consultation",
  "Sports Nutrition",
  "Meal Planning",
  "Diabetes Management",
  "Heart-Healthy Diet",
  "Vegetarian/Vegan Nutrition",
  "Child Nutrition",
  "Senior Nutrition",
  "Eating Disorder Support",
  "Pregnancy Nutrition",
  "Food Allergy Management",
  "Digestive Health"
]

created_services = services_data.map do |service_name|
  Service.find_or_create_by!(name: service_name)
end

nutritionists_data = [
  "Dr. Maria Silva",
  "Dr. João Santos",
  "Dr. Ana Costa",
  "Dr. Pedro Oliveira",
  "Dr. Catarina Ferreira",
  "Dr. Miguel Rodrigues",
  "Dr. Sofia Martins",
  "Dr. Ricardo Pereira",
  "Dr. Beatriz Gomes",
  "Dr. Tiago Almeida",
  "Dr. Inês Carvalho",
  "Dr. Nuno Ribeiro"
]

created_nutritionists = nutritionists_data.map do |nutritionist_name|
  Nutritionist.find_or_create_by!(name: nutritionist_name)
end

created_nutritionists.each do |nutritionist|
  # Each nutritionist offers 2-4 services
  services_count = rand(2..4)
  selected_services = created_services.sample(services_count)

  selected_services.each do |service|
    # Each service can be offered at 1-2 locations
    locations_count = rand(1..2)
    selected_locations = created_locations.sample(locations_count)

    selected_locations.each do |location|
      # Skip if this combination already exists
      next if NutritionistService.exists?(
        nutritionist: nutritionist,
        service: service,
        location: location
      )

      # Generate realistic pricing based on service type
      base_price = case service.name
      when "Weight Loss Consultation" then rand(50..80)
      when "Sports Nutrition" then rand(60..90)
      when "Meal Planning" then rand(40..70)
      when "Diabetes Management" then rand(70..100)
      when "Heart-Healthy Diet" then rand(65..95)
      when "Vegetarian/Vegan Nutrition" then rand(45..75)
      when "Child Nutrition" then rand(55..85)
      when "Senior Nutrition" then rand(50..80)
      when "Eating Disorder Support" then rand(80..120)
      when "Pregnancy Nutrition" then rand(60..90)
      when "Food Allergy Management" then rand(70..100)
      when "Digestive Health" then rand(65..95)
      else rand(50..80)
      end

      NutritionistService.create!(
        nutritionist: nutritionist,
        service: service,
        location: location,
        pricing: base_price + rand(-5..15) # Add some variance
      )
    end
  end
end
