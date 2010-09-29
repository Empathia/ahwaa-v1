require 'spec_helper'

describe Topic do
  before(:each) do
    @topic = Factory(:topic)
  end

  it { should validate_presence_of(:title) }
  it { should validate_presence_of(:content) }
  it { should belong_to(:user) }
  it { should validate_presence_of(:user_id) }
  it { should respond_to(:tag_list) }
  it { should respond_to(:tags) }
end
