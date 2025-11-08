import OpenAI from 'openai';
const { OPENAI_API_KEY } = process.env;
const client = new OpenAI(OPENAI_API_KEY);

// Creating a consistent prompt that can respond to any comment in the world in a funny and not cringey way is quite a difficult task
// Maybe we should work to categorize messages received in some way, and adapt our response to the message based on what category it falls under
const instructions = `
  As a playful friend who likes to tease, respond to the message below by crafting a one-liner message playfully making fun of the person. 
  The tone of the message should be banter-y and sarcastic.
  Ensure the message is playful, is making fun of the person and is not genuinely threatening or too mean.
  Avoid using hyphens ("-"), nicknames/titles and do not explain the joke.
`

export const createGPTMessage = async (userMessage) => {
  try {
    const response = await client.responses.create({
      model: "gpt-5-nano",
      reasoning: { effort: "medium" },
      text: {
        verbosity: 'low'
      },
      input: [
        {
          role: "developer",
          content: instructions
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    })
    let aiResponse = response.output_text;
    return aiResponse
  } catch (err) {
    throw err;
  }
}