export type Lesson = {
  id: string;
  title: string;
  content: string;
  initialCode: string;
  expectedOutput?: string; // Very simple exact match for now
};

export type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type Track = {
  id: string;
  title: string;
  modules: Module[];
};

export const track0: Track = {
  id: 'track-0',
  title: 'Track 0: Absolute Zero',
  modules: [
    {
      id: 'module-0-1',
      title: 'Module 0.1: The Command Line & Environment',
      lessons: [
        {
          id: 'lesson-0-1-1',
          title: 'Hello, World!',
          content: 'Welcome to OpenGuideForAI. In this environment, you will execute Python code natively in your browser. Python is the dominant language for AI engineering. Let us start with the basics: printing text to the console.',
          initialCode: 'print("Hello, World!")',
          expectedOutput: 'Hello, World!',
        }
      ]
    },
    {
      id: 'module-0-2',
      title: 'Module 0.2: Python Basics & JSON',
      lessons: [
        {
          id: 'lesson-0-2-1',
          title: 'Variables & Data',
          content: 'In AI, we constantly pass data around. Variables hold this data. Create a variable called `ai_name` and print it.',
          initialCode: 'ai_name = "Gemini"\nprint(ai_name)',
          expectedOutput: 'Gemini',
        },
        {
          id: 'lesson-0-2-2',
          title: 'Working with JSON',
          content: 'JSON (JavaScript Object Notation) is the standard format for communicating with APIs. We can parse JSON strings into Python dictionaries.',
          initialCode: 'import json\n\ndata_string = \'{"model": "gpt-4", "temperature": 0.7}\'\nparsed_data = json.loads(data_string)\nprint(parsed_data["model"])',
          expectedOutput: 'gpt-4',
        }
      ]
    },
    {
      id: 'module-0-3',
      title: 'Module 0.3: What is an API? Tokens & Prompts',
      lessons: [
        {
          id: 'lesson-0-3-1',
          title: 'Simulating an API Call',
          content: 'An API allows two programs to talk to each other. When you send a prompt to an LLM, you are sending a POST request to an API endpoint. Let\'s mock an API response.',
          initialCode: 'def mock_llm_api(prompt):\n    return f"I am an AI. You said: {prompt}"\n\nresponse = mock_llm_api("Hello?")\nprint(response)',
          expectedOutput: 'I am an AI. You said: Hello?',
        }
      ]
    }
  ]
};
