class CreateSubscriptions < ActiveRecord::Migration
  def self.up
    create_table :subscriptions do |t|
      t.belongs_to :topic
      t.belongs_to :user
      t.string :hash_key

      t.timestamps
    end

    add_index :subscriptions, [:topic_id, :user_id]
    add_index :subscriptions, :hash_key
  end

  def self.down
    drop_table :subscriptions
  end
end
