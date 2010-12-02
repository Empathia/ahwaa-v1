class LevelLoader
  def initialize()
    @levels = [
      {
        :name => 'Silver Heart', 
        :description => 'Silver Heart', 
        :amount_points_of_required => 10,
        :image_url => '/images/levels/silver_heart.png'
      },{
        :name => 'Bronze Heart', 
        :description => 'Bronze Heart', 
        :amount_points_of_required => 50,
        :image_url => '/images/levels/bronze_heart.png'
      },{
        :name => 'Gold Heart', 
        :description => 'Gold Heart', 
        :amount_points_of_required => 100,
        :image_url => '/images/levels/gold_heart.png'
      },{
        :name => 'Green Heart', 
        :description => 'Green Heart', 
        :amount_points_of_required => 500,
        :image_url => '/images/levels/green_heart.png'
      },
    ]
  end

  def load
    @levels.each do |level|
      level_instance = Level.find_or_initialize_by_name(level[:name])
      level_instance.description = level[:description]
      level_instance.amount_points_of_required = level[:amount_points_of_required]
      level_instance.image_url = level[:image_url]
      level_instance.save!
    end
  end
end
