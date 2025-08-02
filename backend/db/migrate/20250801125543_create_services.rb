class CreateServices < ActiveRecord::Migration[8.0]
  def change
    create_table :services, id: :uuid do |t|
      t.string :name

      t.timestamps
    end
  end
end
