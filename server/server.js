import express from "express";
import { Server } from "http";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import searchRouter from "./routers/messengerSearch";
import { initSocket } from "./controllers/socketController";
import { connect } from "./lib/dbConnect";
import { router as trpcRouter } from "./trpc";
import { authRouter } from "./routers/authRouter";
import dotenv from 'dotenv'

dotenv.config()

import Replicate from "replicate";
import { userRouter } from "./routers/userRouter";

// const PORT = 4000;
const PORT = process.env.PORT || 3000;

const app = express();
const http = Server(app);

app.use(express.json());
app.use(cors({ origin: '*' }));

// Initialize socket.io
initSocket(http);

// Init Replicate AI
const replicate = new Replicate({ auth: "r8_2X8Qkd89o0aWxsEo6QKtbGhP23ElCYX12ciX6" });

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api', searchRouter);
app.use(
  "/trpc",
  createExpressMiddleware({
    router: trpcRouter,
  })
);

// ImageGen Endpoint
app.post('/generate-image', async (req, res) => {
  try {
    const { imagePrompt } = req.body;

    console.log("Running the model...");
    const output = await replicate.run('stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b', { input: { prompt: imagePrompt } });
    if (output.length > 0) {
      res.json({ imageUrl: output[0] });
      console.log("Image generated successfully!");
    } else {
      throw new Error('Image generation failed: No image URL found in output');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

// CaptionGen Endpoint
app.post('/generate-caption', async (req, res) => {
  try {
    const { captionPrompt, image } = req.body;

    console.log("Running the model...");
    const output = await replicate.run('yorickvp/llava-13b:b5f6212d032508382d61ff00469ddda3e32fd8a0e75dc39d8a4191bb742157fb', {
      input: {
        image,
        prompt: captionPrompt,
      }
    });
    if (output) {
      res.json(output);
      console.log("Caption generated successfully!");
    } else {
      throw new Error('Caption generation failed');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate caption' });
  }
});

// VideoGen Endpoint
app.post('/generate-video', async (req, res) => {
  try {
    const { videoPrompt } = req.body;

    console.log("Running the model...");
    const output = await replicate.run("anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: {
          fps: 24,
          model: "xl",
          width: 1024,
          height: 576,
          prompt: videoPrompt,
          batch_size: 1,
          num_frames: 24,
          init_weight: 0.5,
          guidance_scale: 17.5,
          // negative_prompt: "very blue, dust, noisy, washed out, ugly, distorted, broken",
          remove_watermark: false,
          num_inference_steps: 50
        }
      });
    if (output) {
      console.log(output)
      res.json({ videoURL: output });
    } else {
      throw new Error('Image generation failed: No image URL found in output');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate video' });
  }
});

connect().then(() => {
  http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
})
