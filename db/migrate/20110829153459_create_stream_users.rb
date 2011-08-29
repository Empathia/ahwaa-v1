class CreateStreamUsers < ActiveRecord::Migration
  def self.up
    create_table :stream_users do |t|
      t.belongs_to :stream_message
      t.belongs_to :user

      t.timestamps
    end
  end

  def self.down
    drop_table :stream_users
  end
end
