import axios from 'axios';

export async function recognizeImage(base64Image,user_api_key) {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${user_api_key}`
  };

  const payload = {
    "model": "gpt-4-vision-preview",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Given the image, please provide the image's name, Latin name, and a short description of the plant in the image. Please reply in JSON foramt, and only have json, do not contains other any symbol. Noted, please only give JSON String format, no other symbol. The JSON key is: 'name', 'latinName', 'description'."
          },
          {
            "type": "image_url",
            "image_url": {
              "url": `data:image/jpeg;base64,${base64Image}`
            }
          }
        ]
      }
    ],
    "max_tokens": 300
  };

  const response = await axios.post("https://api.openai.com/v1/chat/completions", payload, { headers });

  return response;
}
