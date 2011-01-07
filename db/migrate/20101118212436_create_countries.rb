class CreateCountries < ActiveRecord::Migration
  def self.up
    create_table :countries do |t|
      t.string :i18n_name
      t.timestamps
    end
    
    
    
    countries = ["afghanistan", "algeria", "armenia", "azerbaijan", "bahrain", "djibouti", "egypt", "iran", "iraq", "kurdistan", "palestine", "jordan", "kuwait", "lebanon",
    "libya", "morocco", "oman", "qatar", "saudi_arabia", "ethiopia", "sudan", "syrian", "tunisia", "turkey", "united_arab_emirates", "yemen", "pakistan", "other"]

    Country.create(countries.map { |i| {:i18n_name => i} })

    add_index :countries, :i18n_name, :unique => true
  end

  def self.down
    drop_table :countries
  end
end
