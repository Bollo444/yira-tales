const openaiService = require('../services/openaiService');
const fs = require('fs');
const path = require('path');

/**
 * Handles the request to generate a story.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
async function generateStory(req, res) {
  try {
    const { prompt, genre, tone, pov, character, setting } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const storyStream = await openaiService.generateStoryStream({
      prompt,
      genre,
      tone,
      pov,
      character,
      setting,
    });

    if (!storyStream) {
      return res.status(500).json({ message: 'Failed to generate story stream from OpenAI' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Pipe the stream from OpenAI directly to the client
    // OpenAI's SDK returns a stream of Server-Sent Events (SSE)
    for await (const chunk of storyStream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
      if (chunk.choices[0]?.finish_reason === 'stop') {
        break;
      }
    }
    res.write('data: [DONE]\n\n'); // Signal completion to the client
    res.end();

  } catch (error) {
    console.error('Error in generateStory controller:', error);
    // Ensure response is not sent if headers already sent
    if (!res.headersSent) {
        res.status(500).json({ message: 'Internal server error while generating story' });
    }
  }
}

/**
 * Handles the user's turn in co-authoring mode.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
async function handleUserTurn(req, res) {
  try {
    const { storyId, userContent } = req.body;
    
    if (!storyId || !userContent) {
      return res.status(400).json({ message: 'Story ID and user content are required' });
    }
    
    // Here we would typically save the user's contribution to the story
    // For MVP, we'll just acknowledge receipt and store it in memory
    // In a production app, this would be saved to a database
    
    // For now, we'll use a simple in-memory store (this would be replaced with a database in production)
    if (!global.coAuthoringStories) {
      global.coAuthoringStories = {};
    }
    
    if (!global.coAuthoringStories[storyId]) {
      global.coAuthoringStories[storyId] = [];
    }
    
    global.coAuthoringStories[storyId].push({
      type: 'user',
      content: userContent,
      timestamp: new Date()
    });
    
    return res.status(200).json({ 
      message: 'User turn received successfully',
      storyId
    });
    
  } catch (error) {
    console.error('Error in handleUserTurn controller:', error);
    return res.status(500).json({ message: 'Internal server error while processing user turn' });
  }
}

/**
 * Handles the AI's turn in co-authoring mode.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
async function handleAiTurn(req, res) {
  try {
    const { storyId } = req.query;
    
    if (!storyId) {
      return res.status(400).json({ message: 'Story ID is required' });
    }
    
    // Check if we have this story in our in-memory store
    if (!global.coAuthoringStories || !global.coAuthoringStories[storyId]) {
      return res.status(404).json({ message: 'Story not found' });
    }
    
    // Get the story content so far
    const storyContent = global.coAuthoringStories[storyId];
    
    // Generate AI's contribution based on the story so far
    const aiContent = await openaiService.generateCoAuthorTurn(storyContent);
    
    if (!aiContent) {
      return res.status(500).json({ message: 'Failed to generate AI turn' });
    }
    
    // Add AI's contribution to the story
    global.coAuthoringStories[storyId].push({
      type: 'ai',
      content: aiContent,
      timestamp: new Date()
    });
    
    return res.status(200).json({
      aiContent,
      storyId
    });
    
  } catch (error) {
    console.error('Error in handleAiTurn controller:', error);
    return res.status(500).json({ message: 'Internal server error while generating AI turn' });
  }
}

/**
 * Handles the request to export a story to TXT or PDF format.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
async function exportStory(req, res) {
  try {
    const { storyId, format, storyContent, title } = req.body;
    
    if (!storyContent) {
      return res.status(400).json({ message: 'Story content is required' });
    }
    
    if (!format || !['txt', 'pdf'].includes(format.toLowerCase())) {
      return res.status(400).json({ message: 'Valid format (txt or pdf) is required' });
    }
    
    const storyTitle = title || 'Untitled Story';
    
    // Format the story content based on the requested format
    if (format.toLowerCase() === 'txt') {
      // For TXT format, we'll just return the plain text with some formatting
      let formattedContent = `${storyTitle}\n\n`;
      
      // If it's a co-authored story, format it accordingly
      if (Array.isArray(storyContent)) {
        storyContent.forEach(segment => {
          formattedContent += `${segment.type === 'user' ? 'Human' : 'AI'}: ${segment.content}\n\n`;
        });
      } else {
        // For regular stories, just use the content as is
        formattedContent += storyContent;
      }
      
      // Return the formatted content
      return res.status(200).json({
        format: 'txt',
        content: formattedContent,
        filename: `${storyTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
      });
    } 
    else if (format.toLowerCase() === 'pdf') {
      // For PDF format, we'll return instructions for the frontend
      // In a production app, we might generate the PDF on the backend
      // For MVP, we'll let the frontend handle PDF generation
      
      let formattedContent = `${storyTitle}\n\n`;
      
      // Format the content the same way as TXT
      if (Array.isArray(storyContent)) {
        storyContent.forEach(segment => {
          formattedContent += `${segment.type === 'user' ? 'Human' : 'AI'}: ${segment.content}\n\n`;
        });
      } else {
        formattedContent += storyContent;
      }
      
      return res.status(200).json({
        format: 'pdf',
        content: formattedContent,
        filename: `${storyTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
        // Include any additional metadata needed for PDF generation
        metadata: {
          title: storyTitle,
          createdAt: new Date().toISOString()
        }
      });
    }
    
  } catch (error) {
    console.error('Error in exportStory controller:', error);
    return res.status(500).json({ message: 'Internal server error while exporting story' });
  }
}

/**
 * Regenerates a specific paragraph in a story.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
async function regenerateParagraph(req, res) {
  try {
    const { 
      paragraphIndex, 
      currentParagraph, 
      previousContext, 
      followingContext,
      genre, 
      tone, 
      pov, 
      character, 
      setting 
    } = req.body;

    if (paragraphIndex === undefined || currentParagraph === undefined) {
      return res.status(400).json({ message: 'Paragraph index and current paragraph content are required' });
    }

    // Construct a prompt for regenerating the paragraph
    const regenerationPrompt = `
      You are tasked with rewriting a paragraph in a story. 
      ${genre ? `The story genre is: ${genre}.` : ''}
      ${tone ? `The tone should be: ${tone}.` : ''}
      ${pov ? `The point of view is: ${pov}.` : ''}
      ${character ? `The main character is: ${character}.` : ''}
      ${setting ? `The setting is: ${setting}.` : ''}
      
      ${previousContext ? `Previous context:\n${previousContext}\n\n` : ''}
      
      Rewrite the following paragraph, maintaining consistency with the context but making it more engaging:
      "${currentParagraph}"
      
      ${followingContext ? `\n\nFollowing context:\n${followingContext}` : ''}
      
      Provide only the rewritten paragraph, without any additional commentary or explanation.
    `;

    // Call OpenAI to regenerate the paragraph
    const completion = await openaiService.generateCompletion(regenerationPrompt);

    if (!completion) {
      return res.status(500).json({ message: 'Failed to regenerate paragraph' });
    }

    // Return the regenerated paragraph
    return res.status(200).json({ content: completion.trim() });

  } catch (error) {
    console.error('Error in regenerateParagraph controller:', error);
    return res.status(500).json({ message: 'Internal server error while regenerating paragraph' });
  }
}

module.exports = {
  generateStory,
  handleUserTurn,
  handleAiTurn,
  exportStory,
  regenerateParagraph
};