class CreateSexualOrientations < ActiveRecord::Migration
  def self.up
    create_table :sexual_orientations do |t|
      t.string :i18n_name
      t.timestamps
    end

    SexualOrientation.create(%w[straight gay lesbian bisexual queer transsexual pansexual
    intersexual transvestite no_say].map { |i| {:i18n_name => i} })

    add_index :sexual_orientations, :i18n_name, :unique => true
  end

  def self.down
    drop_table :sexual_orientations
  end
end
