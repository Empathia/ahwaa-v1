class CreateReligions < ActiveRecord::Migration
  def self.up
    create_table :religions do |t|
      t.string :i18n_name
      t.timestamps
    end

    Religion.create(%w[agnostic bahai druze buddhism christianity confucianism hinduism
    islam jainism judaism shinto sikhism taoism yazidi zoroastrianism atheism none other].map { |i|
      {:i18n_name => i} })
  end

  def self.down
    drop_table :religions
  end
end
