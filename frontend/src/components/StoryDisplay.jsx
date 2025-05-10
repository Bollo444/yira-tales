import { useEffect, useState, useRef } from 'react';
import useStoryStore from '../store/storyStore';
import CoAuthorInterface from './CoAuthorInterface';
import ExportOptions from './ExportOptions';

const StoryDisplay = () => {
  const { 
    storyParameters, 
    generatedStory, 
    isGenerating, 
    updateGeneratedStory,
    storyMode,
    selectedParagraphIndex,
    setSelectedParagraphIndex,
    updateParagraph,
    isPaused,
    setPaused
  } = useStoryStore();
  
  const [streamedContent, setStreamedContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [paragraphs, setParagraphs] = useState([]);
  const [editingText, setEditingText] = useState('');
  const contentRef = useRef(null);
  const readerRef = useRef(null);
  const controllerRef = useRef(null);

  // Auto-scroll to bottom of content as new text arrives
  useEffect(() => {
    if (contentRef.current && !selectedParagraphIndex) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [streamedContent, selectedParagraphIndex]);
  
  // Split content into paragraphs whenever content changes
  useEffect(() => {
    if (streamedContent || generatedStory) {
      const content = streamedContent || generatedStory;
      // Split by double newlines or single newlines
      const split = content.split(/\n\n|\n/).filter(p => p.trim().length > 0);
      setParagraphs(split);
    }
  }, [streamedContent, generatedStory]);

  // Function to handle streaming from the backend
  const streamStoryContent = async () => {
    try {
      setIsStreaming(true);
      setError(null);
      setStreamedContent(''); // Clear previous content
      setPaused(false);
      
      // Prepare the request parameters based on story mode and inputs
      const params = {
        ...storyParameters,
        mode: storyMode
      };
      
      // Create an AbortController to allow cancellation
      const controller = new AbortController();
      controllerRef.current = controller;
      
      // Make the fetch request to the backend streaming endpoint
      const response = await fetch('http://localhost:3000/api/story/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      // Set up event source for server-sent events
      const reader = response.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let accumulatedContent = '';
      
      // Process the stream
      while (true) {
        // Check if we should pause
        if (isPaused) {
          // Wait for a short time before checking again
          await new Promise(resolve => setTimeout(resolve, 100));
          continue;
        }
        
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        // Decode the chunk and process it
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.substring(6);
            
            if (data === '[DONE]') {
              // Streaming is complete
              break;
            }
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulatedContent += parsed.content;
                setStreamedContent(accumulatedContent);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
      
      // Update the story store with the complete content
      updateGeneratedStory(accumulatedContent);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Story generation was aborted');
      } else {
        console.error('Error streaming story:', err);
        setError(err.message || 'An error occurred while streaming the story');
      }
    } finally {
      setIsStreaming(false);
      readerRef.current = null;
      controllerRef.current = null;
    }
  };

  // Function to handle pausing generation
  const handlePauseGeneration = () => {
    setPaused(true);
  };
  
  // Function to handle resuming generation
  const handleResumeGeneration = () => {
    setPaused(false);
  };
  
  // Function to handle paragraph selection
  const handleParagraphSelect = (index) => {
    if (selectedParagraphIndex === index) {
      // Deselect if already selected
      setSelectedParagraphIndex(null);
      setEditingText('');
    } else {
      setSelectedParagraphIndex(index);
      setEditingText(paragraphs[index]);
    }
  };
  
  // Function to handle paragraph editing
  const handleEditChange = (e) => {
    setEditingText(e.target.value);
  };
  
  // Function to save edited paragraph
  const handleSaveEdit = () => {
    if (selectedParagraphIndex !== null) {
      // Create a new array of paragraphs with the edited one
      const newParagraphs = [...paragraphs];
      newParagraphs[selectedParagraphIndex] = editingText;
      
      // Join paragraphs back into a single string
      const newContent = newParagraphs.join('\n\n');
      
      // Update the story
      updateGeneratedStory(newContent);
      updateParagraph(selectedParagraphIndex, editingText);
      
      // Reset selection
      setSelectedParagraphIndex(null);
      setEditingText('');
    }
  };
  
  // Function to regenerate a paragraph
  const handleRegenerateParagraph = async () => {
    if (selectedParagraphIndex !== null) {
      try {
        // Set loading state
        setError(null);
        
        // Prepare the request parameters
        const params = {
          ...storyParameters,
          mode: storyMode,
          paragraphIndex: selectedParagraphIndex,
          currentParagraph: paragraphs[selectedParagraphIndex],
          previousContext: selectedParagraphIndex > 0 ? 
            paragraphs.slice(0, selectedParagraphIndex).join('\n\n') : '',
          followingContext: selectedParagraphIndex < paragraphs.length - 1 ? 
            paragraphs.slice(selectedParagraphIndex + 1).join('\n\n') : ''
        };
        
        // Make the fetch request to regenerate the paragraph
        const response = await fetch('http://localhost:3000/api/story/regenerate-paragraph', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });
        
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.content) {
          // Create a new array of paragraphs with the regenerated one
          const newParagraphs = [...paragraphs];
          newParagraphs[selectedParagraphIndex] = result.content;
          
          // Join paragraphs back into a single string
          const newContent = newParagraphs.join('\n\n');
          
          // Update the story
          updateGeneratedStory(newContent);
          updateParagraph(selectedParagraphIndex, result.content);
          
          // Reset selection
          setSelectedParagraphIndex(null);
          setEditingText('');
        }
      } catch (err) {
        console.error('Error regenerating paragraph:', err);
        setError(err.message || 'An error occurred while regenerating the paragraph');
      }
    }
  };
  
  // Function to cancel editing
  const handleCancelEdit = () => {
    setSelectedParagraphIndex(null);
    setEditingText('');
  };

  return (
    <>
      {storyMode === 'co-author' ? (
        <CoAuthorInterface />
      ) : (
        <div className="mt-8 border-t border-gray-700 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Your Story</h3>
            
            <div className="flex space-x-2">
              {!isStreaming && !generatedStory && (
                <button
                  onClick={streamStoryContent}
                  disabled={isStreaming}
                  className="px-4 py-2 bg-orange-800 text-white rounded-md hover:bg-orange-700 transition-colors disabled:bg-orange-900"
                >
                  Generate Story
                </button>
              )}
              
              {isStreaming && !isPaused && (
                <button
                  onClick={handlePauseGeneration}
                  className="px-4 py-2 bg-orange-800 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  Pause Generation
                </button>
              )}
              
              {isStreaming && isPaused && (
                <button
                  onClick={handleResumeGeneration}
                  className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Resume Generation
                </button>
              )}
            </div>
          </div>
          
          {/* Story content display area */}
          <div 
            ref={contentRef}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 h-96 overflow-y-auto"
          >
            {error && (
              <div className="text-red-500 mb-4">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
              </div>
            )}
            
            {isStreaming && !streamedContent && (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-gray-400">
                  Generating your story...
                </div>
              </div>
            )}
            
            {/* Paragraph editing mode */}
            {selectedParagraphIndex !== null && (
              <div className="mb-4 border-b border-gray-700 pb-4">
                <h4 className="text-white mb-2 font-medium">Editing Paragraph {selectedParagraphIndex + 1}</h4>
                <textarea
                  value={editingText}
                  onChange={handleEditChange}
                  className="w-full h-32 p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:border-orange-700 focus:ring focus:ring-orange-700 focus:ring-opacity-50"
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1 bg-orange-800 text-white text-sm rounded-md hover:bg-orange-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleRegenerateParagraph}
                    className="px-3 py-1 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Regenerate
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            {/* Display paragraphs with selection capability */}
            {(paragraphs.length > 0) && (
              <div className="prose prose-invert max-w-none">
                {paragraphs.map((paragraph, index) => (
                  <div 
                    key={index}
                    className={`mb-4 p-2 rounded ${selectedParagraphIndex === index ? 'bg-gray-700' : 'hover:bg-gray-700/50 cursor-pointer'}`}
                    onClick={() => !isStreaming && handleParagraphSelect(index)}
                  >
                    <p className="m-0">{paragraph}</p>
                  </div>
                ))}
              </div>
            )}
            
            {isStreaming && streamedContent && !isPaused && (
              <span className="inline-block animate-pulse ml-1 text-orange-500">▌</span>
            )}
          </div>
          
          {/* Status indicator */}
          {isStreaming && (
            <div className="mt-2 text-sm text-gray-400 flex items-center">
              {isPaused ? (
                <>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  Generation paused
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Streaming story content...
                </>
              )}
            </div>
          )}
          
          {/* Paragraph editing instructions */}
          {!isStreaming && paragraphs.length > 0 && selectedParagraphIndex === null && (
            <div className="mt-2 text-sm text-gray-400">
              <p>Click on any paragraph to edit or regenerate it.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Export Options - show only when there's content to export */}
      {generatedStory && <ExportOptions />}
    </>
  );
};

export default StoryDisplay;