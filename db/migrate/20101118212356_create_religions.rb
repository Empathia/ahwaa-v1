class CreateReligions < ActiveRecord::Migration
  def self.up
    create_table :religions do |t|
      t.string :i18n_name
      t.timestamps
    end

    Religion.create(%w[agnostic bahai druze buddhism christianity confucianism hinduism
    islam jainism judaism shinto sikhism taoism yazidi zoroastrianism atheism none other secular not_say].map { |i|
      {:i18n_name => i} })

    add_index :religions, :i18n_name, :unique => true
  end

  def self.down
    drop_table :religions
  end
end
