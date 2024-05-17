import dotenv from 'dotenv';
import OpenAI from "openai";
import fs from "fs";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OpenAI_API_KEY
});


async function main() {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream("./resources/audio/narcissus-greek-myth.mp3"),
    model: "whisper-1",
  });

  console.log(transcription.text);
}
main();