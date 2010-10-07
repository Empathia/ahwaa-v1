class CreateTopicExperts < ActiveRecord::Migration
  def self.up
    create_table :topic_experts do |t|
      t.belongs_to :topic
      t.belongs_to :expert

      t.timestamps
    end
  end

  def self.down
    drop_table :topic_experts
  end
end
