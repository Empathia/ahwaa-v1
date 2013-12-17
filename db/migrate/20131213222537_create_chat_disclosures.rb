class CreateChatDisclosures < ActiveRecord::Migration
  def self.up
    create_table :chat_disclosures do |t|
      t.integer :user_id

      t.timestamps
    end
  end

  def self.down
    drop_table :chat_disclosures
  end
end
