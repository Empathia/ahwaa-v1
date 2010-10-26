class CreateRelatedLinks < ActiveRecord::Migration
  def self.up
    create_table :related_links do |t|
      t.belongs_to :topic
      t.string :title
      t.string :description
      t.string :source_url
      t.string :thumbnail_file_name
      t.string :thumbnail_content_type
      t.integer :thumbnail_file_size
      t.datetime :thumbnail_updated_at

      t.timestamps
    end
  end

  def self.down
    drop_table :related_links
  end
end
