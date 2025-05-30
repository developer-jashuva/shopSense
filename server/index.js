require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const {GoogleGenAI} =require('@google/genai'); //'@google/genai';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});


const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// app.post('/analyze', async (req, res) => {
//   console.log('going to analyze the review');
  
//   const reviews = req.body.reviews;

//   const prompt = `
// You are a helpful assistant. Analyze the following product reviews and:
// 1. Summarize the overall sentiment (Positive, Mixed, or Negative)
// 2. Highlight common pros and cons.
// 3. Give a trust score out of 100 based on sentiment consistency and review quality.

// Reviews:
// ${reviews.map((r, i) => `${i + 1}. [${r.rating}⭐] ${r.text}`).join("\n")}
// `;

//   try {
//     const response =await ai.models.generateContent({
//       model: 'gemini-2.0-flash-001',
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: prompt }]
//         }
//       ]
//     });
    
    
//     const result = parseSentimentSummary(response.text);
//     console.log(result);
    
//     // const result = response.data.candidates[0].content.parts[0].text;
//     res.json({ result });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to analyze sentiment" });
//   }
// });
app.post('/analyze', async (req, res) => {
  console.log('Going to analyze the review');

  const { reviews } = req.body;
  // console.log(reviews);

  const prompt = `
You are a helpful assistant. Analyze reviews for the product. Based on these reviews:

1. Summarize the overall sentiment (Positive, Mixed, or Negative)
2. Highlight common pros and cons
3. Provide a trust score out of 100

Reviews:
${reviews.map((r, i) => `${i + 1}. [${r.rating}⭐] ${r.text}`).join("\n")}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const result = parseSentimentSummary(response.text);
    // console.log(result);
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze sentiment" });
  }
});

function parseSentimentSummary(responseText) {
  const sentimentMatch = responseText.match(/\*\*1\. Overall Sentiment:\*\*[\s\S]*?is \*\*(.*?)\*\*/);
  const trustScoreMatch = responseText.match(/trust score of \*\*(\d+)\/100\*\*/);

  const pros = [...responseText.matchAll(/\*\*Pros:\*\*([\s\S]*?)\*\*Cons:\*\*/g)][0]?.[1]
    ?.split('\n')
    ?.filter(line => line.trim().startsWith('*'))
    ?.map(line => line.replace(/^\*\s+\*\*(.*?)\*\*:?\s*/, '$1').trim());

  const cons = [...responseText.matchAll(/\*\*Cons:\*\*([\s\S]*?)\*\*3\. Trust Score:\*\*/g)][0]?.[1]
    ?.split('\n')
    ?.filter(line => line.trim().startsWith('*'))
    ?.map(line => line.replace(/^\*\s+\*\*(.*?)\*\*:?\s*/, '$1').trim());

  return {
    sentiment: sentimentMatch?.[1] ?? 'Unknown',
    trustScore: trustScoreMatch?.[1] ?? 'N/A',
    pros: pros ?? [],
    cons: cons ?? [],
  };
}


app.listen(PORT, () => {
  console.log(`✅ Gemini API server running at http://localhost:${PORT}`);
});
