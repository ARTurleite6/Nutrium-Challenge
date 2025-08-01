class CreateNutritionists < ActiveRecord::Migration[8.0]
  def change
    create_table :nutritionists, id: :uuid do |t|
      t.string :name, null: false

      t.timestamps
    end

    add_index :nutritionists, :name
  end
end
