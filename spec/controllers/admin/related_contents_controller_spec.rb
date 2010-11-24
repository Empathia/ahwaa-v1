require 'spec_helper'

describe Admin::RelatedContentsController do

  before(:each) do
    @admin = Factory(:admin)
    sign_in @admin
  end


  describe "GET 'index'" do

    it "shouldnt list related content for a non exixting topic" do
      lambda do
        get :index, :topic_id => 1
      end.should raise_error
    end

    context 'with an existing topic' do

      before(:each) do
        @topic = Factory(:topic)
      end

      it "should list related content list" do
        get :index, :topic_id => @topic.id
        response.should_not be_redirect
        assigns(:topic).should == @topic
      end

      it "should list existing related content for topic" do
        @related_content = Factory(:related_video)
        @related_content.topic = @topic
        @related_content.save!
        get :index, :topic_id => @topic.id
        response.should be_succes
        assigns(:topic).should == @topic
        assigns(:related_contents).should == [@related_content]
      end
    end

  end

  describe "create related content" do

    before(:each) do
      @topic = Factory(:topic)
    end

    it "create a related video" do
      lambda do
        post :create, :topic_id => @topic.id, :related_content => {
          :source_url => 'http://www.youtube.com/watch?v=k7pv0cDVPz0'
        }
      end.should change(RelatedContent, :count).by(1)

      response.should be_redirect
      RelatedContent.last.type.should == 'RelatedVideo'
      request.flash.to_s.should =~ /notice/
    end

    it "create a related image" do
      lambda do
        post :create, :topic_id => @topic.id, :related_content => {
          :source_url => 'http://www.flickr.com/photos/anasilva/5038885831'
        }
      end.should change(RelatedContent, :count).by(1)

      response.should be_redirect
      RelatedContent.last.type.should == 'RelatedImage'
      request.flash.to_s.should =~ /notice/
    end

    it "should return the possible thumbnails for a link if a thumbnail url is not provided" do
       post :create, :topic_id => @topic.id, :related_content => {
          :source_url => 'http://www.elpais.com/articulo/internacional/Gobierno/chileno/quiere/tener/minero/superficie/acabe/dia/elpepuint/20101012elpepuint_9/Tes'
       }, :format => 'js'
       assigns(:possible_thumbnails)
       response.should_not be_redirect
    end

    it "create a related link" do
      lambda do
        post :create, :topic_id => @topic.id, :related_content => {
          :source_url => 'http://www.elpais.com/articulo/internacional/Gobierno/chileno/quiere/tener/minero/superficie/acabe/dia/elpepuint/20101012elpepuint_9/Tes',
          :thumbnail_url => 'https://github.com/images/modules/header/logov3-hover.png'
        }
      end.should change(RelatedContent, :count).by(1)

      response.should be_redirect
      RelatedContent.last.type.should == 'RelatedLink'
      request.flash.to_s.should =~ /notice/

    end

    it "should not create resource with invalid suff" do
      lambda do
        post :create, :topic_id => @topic.id, :related_content => {
          :source_url => ','
        }
      end.should change(RelatedContent, :count).by(0)

      response.should be_redirect
      request.flash.to_s.should =~ /error/
    end
  end

  describe 'delete related content' do
    it "should delete a created related content" do
      @topic = Factory(:topic)
      @related_content = Factory(:related_video)
      @related_content.topic = @topic
      @related_content.save!

      lambda do
        delete :destroy, :topic_id => @topic.id, :id => @related_content.id
      end.should change(RelatedContent, :count).by( -1 )

      response.should be_redirect
      request.flash.to_s.should =~ /notice/
    end
  end

end
