class CreateTopicExperts < ActiveRecord::Migration
  def self.up
    create_table :topic_experts do |t|
      t.belongs_to :topic
      t.belongs_to :expert

      t.timestamps
    end

    add_index :topic_experts, :topic_id
    add_index :topic_experts, :expert_id
  end

  def self.down
    drop_table :topic_experts
  end
end
