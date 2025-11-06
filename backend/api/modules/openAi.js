import OpenAI from 'openai';
const { OPENAI_API_KEY } = process.env;
const client = new OpenAI(OPENAI_API_KEY);

// Creating a consistent prompt that can respond to any comment in the world in a funny and not cringey way is quite a difficult task
// Maybe we should work to categorize messages received in some way, and adapt our response to the message based on what category it falls under
const instructions = `
  As a comedian, respond to the message below by crafting a one-liner insult that is sarcastic and specifically targets the person. 
  The tone of the insult should be humorous and banter-y.
  Ensure the insult is not genuinely threatening.
  Avoid using hyphens ("-"), name calling, and do not explain the joke.
  If the message below doesn't have anything to insult, feel free to make the insult generic.
`
// The following are example responses to messages that were good:
// People arent as quirky as before: You miss quirky because your personality stopped upgrading after the last patch.
// am I going to be your kitchen :0    : Nice try but you belong in my kitchen as garnish because you add zero flavor to this stream.
// water is literally a buzz kill : Your take is so dry even water wants to evaporate.
// what happened so far : Not much, just the riveting saga of you asking for a recap and forgetting it instantly.

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