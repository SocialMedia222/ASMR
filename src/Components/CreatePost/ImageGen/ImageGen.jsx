import { FaRandom } from "react-icons/fa";
import React, { useState } from "react";

function ImageGen({ imageUrl, setImageUrl }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePrompt, setImagePrompt] = useState(
    "A close-up photo of a delicious dessert with intricate details"
  );
  const [error, setError] = useState(null);

  const generateImage = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:4000/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imagePrompt }),
      });

      const data = await response.json();
      setImageUrl(data?.imageUrl);
      setIsGenerating(false);
    } catch (error) {
      setIsGenerating(false);
      console.error(error);
      setError("Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const randomImage = async () => {
    const imagePrompts = [
      "A majestic landscape with a winding river flowing through a lush forest",
      "A cyberpunk city at night, neon signs reflecting in a rainy street",
      "A playful cartoon cat wearing a pirate hat and riding a treasure chest",
      "A portrait of a wise old owl perched on a bookshelf filled with ancient texts",
      "A photorealistic image of a cat wearing a spacesuit exploring Mars",
      "A vibrant underwater scene with colorful coral reefs and exotic fish",
      "A futuristic cityscape with flying cars and towering skyscrapers",
      "A portrait of a historical figure in a fantastical setting",
      "A close-up photo of a delicious dessert with intricate details",
      "A breathtaking mountain range shrouded in mist at sunrise",
    ];

    const random = Math.floor(Math.random() * 100);
    const randomPrompt = imagePrompts[random % imagePrompts.length];
    setImagePrompt(randomPrompt);
  };

  return (
    <section className="text-white w-[500px]">
      <h2 className="my-3">Image Generation</h2>
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Enter prompt"
          value={imagePrompt}
          onChange={(e) => setImagePrompt(e.target.value)}
          cols={5}
          rows={2}
        />
        <button
          className="btn text-purple-300 border-purple-400"
          disabled={isGenerating}
          onClick={generateImage}
        >
          {isGenerating ? "Generating" : "Generate"}
        </button>
        <button
          className="btn text-purple-300 border-purple-400"
          onClick={randomImage}
        >
          <FaRandom size={23} />
        </button>
      </div>

      <div className="my-4">
        <img
          src={imageUrl}
          alt="img"
          className="pb-10 object-cover rounded-md"
          style={{ width: "100%", height: "400px" }}
        />
      </div>
    </section>
  );
}

export default ImageGen;
