const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates a story stream based on the provided prompt and options.
 * @param {object} options - The options for story generation.
 * @param {string} options.prompt - The initial prompt for the story.
 * @param {string} [options.genre] - The genre of the story.
 * @param {string} [options.tone] - The tone of the story.
 * @param {string} [options.pov] - The point of view for the story.
 * @param {string} [options.character] - The main character's description.
 * @param {string} [options.setting] - The setting of the story.
 * @returns {Promise<ReadableStream|null>} A stream of story content or null if an error occurs.
 */
async function generateStoryStream(options) {
  try {
    // TODO: Construct a more detailed prompt based on all options
    const stream = await openai.chat.completions.create({
      model: 'gpt-4', // Or your preferred model
      messages: [{ role: 'user', content: options.prompt }],
      stream: true,
    });
    return stream;
  } catch (error) {
    console.error('Error generating story stream from OpenAI:', error);
    return null;
  }
}

/**
 * Generates the AI's turn in co-authoring mode based on the story content so far.
 * @param {Array} storyContent - Array of story segments with user and AI contributions.
 * @returns {Promise<string|null>} The AI's contribution or null if an error occurs.
 */
async function generateCoAuthorTurn(storyContent) {
  try {
    // Construct a prompt based on the story content so far
    let prompt = "You are co-authoring a story with a human writer. Continue the story based on what has been written so far. ";
    prompt += "Write a paragraph or two that naturally continues the narrative. ";
    prompt += "Be creative and maintain the tone and style established in the previous parts.\n\n";
    
    // Add the story content so far to the prompt
    prompt += "Story so far:\n";
    storyContent.forEach(segment => {
      prompt += `${segment.type === 'user' ? 'Human' : 'AI'}: ${segment.content}\n\n`;
    });
    
    prompt += "Your turn to continue the story:";
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4', // Or your preferred model
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500, // Limit the length of the AI's turn
      temperature: 0.7, // Slightly creative but not too random
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating co-author turn from OpenAI:', error);
    return null;
  }
}

/**
 * Generates a completion based on the provided prompt.
 * @param {string} prompt - The prompt for generating content.
 * @returns {Promise<string|null>} The generated content or null if an error occurs.
 */
async function generateCompletion(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4', // Or your preferred model
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000, // Adjust as needed
      temperature: 0.7, // Balanced creativity
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating completion from OpenAI:', error);
    return null;
  }
}

module.exports = {
  generateStoryStream,
  generateCoAuthorTurn,
  generateCompletion
};