// WARNING: This exposes your API key to users. Only use for testing!

const OPENAI_API_KEY = 'your-api-key-here'; // Don't do this in production!

async function generateWithOpenAI(type, topic, audience, tone) {
  try {
    setIsLoading(true);
    setError('');

    let prompt = '';
    if (type === 'hook') {
      prompt = `Write a compelling hook for content about "${topic}". Target audience: ${audience}. Tone: ${tone}. Make it attention-grabbing and engaging. Keep it under 50 words.`;
    } else if (type === 'opener') {
      prompt = `Write an engaging opener for content about "${topic}". Target audience: ${audience}. Tone: ${tone}. Make it draw readers in immediately. Keep it under 100 words.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional copywriter specializing in creating compelling hooks and openers for content marketing.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating content:', error);
    setError('Failed to generate content. Please check your API key and try again.');
    throw error;
  } finally {
    setIsLoading(false);
  }
}

// Usage in your component
const handleGenerate = async () => {
  if (!topic.trim()) {
    setError('Please enter a topic');
    return;
  }

  try {
    const content = await generateWithOpenAI(selectedType, topic, audience, tone);
    setGeneratedContent(content);
    
    // Add to history
    const newEntry = {
      id: Date.now(),
      type: selectedType,
      topic,
      audience,
      tone,
      content,
      timestamp: new Date().toISOString()
    };
    
    setHistory(prev => [newEntry, ...prev]);
  } catch (error) {
    // Error is already handled in generateWithOpenAI function
  }
};
