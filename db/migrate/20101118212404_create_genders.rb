class CreateGenders < ActiveRecord::Migration
  def self.up
    create_table :genders do |t|
      t.string :i18n_name
      t.timestamps
    end

    Gender.create(%w[male female transgender no_say].map { |i| {:i18n_name => i} })

    add_index :genders, :i18n_name, :unique => true
  end

  def self.down
    drop_table :genders
  end
end
