import React, { useState } from "react";
import ImageGen from "./ImageGen/ImageGen";
import "./CreatePost.css";
import PostPreview from "./PostPreview";
import VideoGen from "./VideoGen/VideoGen";

function CreatePost() {
  const [imageUrl, setImageUrl] = useState("http://placeholder.co/400x300");
  const [caption, setCaption] = useState("Caption will appear here :)");
  const [videoPrompt, setVideoPrompt] = useState("Elon musk riding horse");
  const [video, setVideo] = useState(null);
  const [currentTool, setCurrentTool] = useState("ImageGen");

  return (
    <section className="create-post-container w-screen h-screen">
      <div className="h-full overflow-y-auto px-4 pt-3">
        {/* AI Tools Navigation */}
        <div className="flex gap-3 mb-3">
          <button
            className="ai-tools-nav-btn btn bg-purple-700 text-white shadow"
            onClick={() => setCurrentTool("ImageGen")}
          >
            <span className="btn-text">Image Gen</span>
          </button>
          <button
            className="ai-tools-nav-btn btn bg-purple-700 text-white shadow"
            onClick={() => setCurrentTool("VideoGen")}
          >
            <span className="btn-text">Video Gen</span>
          </button>
          <button
            className="ai-tools-nav-btn btn bg-purple-700 text-white shadow"
            onClick={() => setCurrentTool("MemeGen")}
          >
            <span className="btn-text">Meme Gen</span>
          </button>
        </div>

        <div className="AI-container rounded-lg shadow-lg px-5 pt-4 mb-4">
          <div className="flex justify-between">
            {/* AI Tools */}
            <div className="mt-3">
              {currentTool === "ImageGen" ? (
                <ImageGen imageUrl={imageUrl} setImageUrl={setImageUrl} />
              ) : currentTool === "VideoGen" ? (
                <VideoGen
                  videoPrompt={videoPrompt}
                  setVideoPrompt={setVideoPrompt}
                  video={video}
                  setVideo={setVideo}
                />
              ) : (
                <span className="text-green-400 text-2xl">Coming Soon!!</span>
              )}
            </div>

            {/* Post Preview (on the right) */}
            <div className="flex flex-col items-center">
              <PostPreview
                imageUrl={imageUrl}
                caption={caption}
                setCaption={setCaption}
                currentTool={currentTool}
              />
            </div>
          </div>
          <div className="py-3">
            <button className="btn px-5 text-center bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg hover:border hover:border-gray-400 mx-auto block mb-3">
              Post Now
            </button>
            <span className="text-white text-center block">Or</span>
            <button className="btn text-gray-300 hover:text-gray-200 mt-2 mb-2 mx-auto block">
              Upload from system
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CreatePost;
