class CreateBadWords < ActiveRecord::Migration
  def self.up
    create_table :bad_words do |t|
      t.string :word
      t.timestamps
    end

    add_index :bad_words, :word, :unique => true
  end

  def self.down
    drop_table :bad_words
  end
end
