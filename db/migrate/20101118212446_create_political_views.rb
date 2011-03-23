class CreatePoliticalViews < ActiveRecord::Migration
  def self.up
    create_table :political_views do |t|
      t.string :i18n_name
      t.timestamps
    end

    PoliticalView.create(%w[libertarian liberal conservative nationalist
                         monarchist sharia_law social_democrat socialist
                        pan_arabist green communist anarchist apolitical
                        undeclared].map { |i| {:i18n_name => i} })

    add_index :political_views, :i18n_name, :unique => true
  end

  def self.down
    drop_table :political_views
  end
end
