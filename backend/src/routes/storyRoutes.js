const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');

// Route for story generation
// POST /api/story/generate
router.post('/generate', storyController.generateStory);

// Route for paragraph regeneration
// POST /api/story/regenerate-paragraph
router.post('/regenerate-paragraph', storyController.regenerateParagraph);

// Routes for co-authoring
// POST /api/story/co-author/user-turn
router.post('/co-author/user-turn', storyController.handleUserTurn);

// GET /api/story/co-author/ai-turn
router.get('/co-author/ai-turn', storyController.handleAiTurn);

// Route for exporting stories
// POST /api/story/export
router.post('/export', storyController.exportStory);

module.exports = router;