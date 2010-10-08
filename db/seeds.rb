admin = User.new(:username => "admin", :password => "123456", :password_confirmation => "123456", :email => "admin@lgbt.com")
admin.is_admin = true
admin.save!

user = User.create!(:username => ENV['USER'], :password => '123456', :password_confirmation => '123456', :email => "user@lgbt.com")

expert = User.new(:username => 'dr_expert', :password => '123456', :password_confirmation => '123456', :email => 'dr_expert@lgbt.com')
expert.is_expert = true
expert.save!

topic = Topic.new :title => "This is a topic test",
  :content => "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar. The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli, but the Little Blind Text didn't listen. She packed her seven versalia, put her initial into the belt and made herself on the way. When she reached the first hills of the Italic Mountains, she had a last view back on the skyline of her hometown Bookmarksgrove, the headline of Alphabet Village and the subline of her own road, the Line Lane. Pityful a rethoric question ran over her cheek, then"
topic.user = admin
topic.save!

first_reply = Reply.new(:category => "advice", :contextual_index => 1, :content => "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eget lectus orci, scelerisque aliquet urna. Praesent et dolor massa, vitae aliquam orci. Curabitur orci velit, blandit eu faucibus sit amet, mollis at augue.")
topic.replies << first_reply

reply_reply = Reply.new(:category => "experience", :content => "Hey! I'm replying to the lorem")
reply_reply.user = user
first_reply.replies << reply_reply

3.times do |i|
  reply = Reply.new(:category => "comment", :contextual_index => 2, :content => "This is my humble comment #{i}")
  reply.user = user

  topic.replies << reply
end

topic.experts << expert
