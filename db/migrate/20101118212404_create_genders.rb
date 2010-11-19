class CreateGenders < ActiveRecord::Migration
  def self.up
    create_table :genders do |t|
      t.string :i18n_name
      t.timestamps
    end

    Gender.create(%w[male female transgender no_say].map { |i| {:i18n_name => i} })
  end

  def self.down
    drop_table :genders
  end
end
