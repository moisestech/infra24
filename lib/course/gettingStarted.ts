import type { ChapterData } from '@/types/course'

export const gettingStartedChapter: ChapterData = {
  title: 'Getting Started with Vibecoding',
  subtitle: 'Tools, terms, accounts, and your first creative workflow',
  description:
    'Learn the landscape, choose a starting lane, understand the vocabulary, and make your first browser-based artifact.',
  outcomes: [
    'Understand what vibecoding means in this course',
    'Recognize the main tools and starting paths',
    'Learn terms like IDE, repo, commit, and deploy',
    'Create a GitHub account',
    'Create a first repository',
    'Choose a workspace',
    'Make a first browser-based artifact',
  ],
  paths: [
    {
      id: 'easy',
      title: 'Easy Start',
      stack: 'CodePen + browser + AI chat',
      bestFor: [
        'total beginners',
        'artists who want instant feedback',
        'learners who want the lowest-friction path',
      ],
      steps: [
        'Edit HTML, CSS, and JS in one place',
        'See changes instantly',
        'Save a share link or screenshot',
      ],
    },
    {
      id: 'structured',
      title: 'Structured Start',
      stack: 'GitHub + VS Code',
      bestFor: [
        'learners ready for real files and folders',
        'students who want solid project structure',
        'people who want a clean path to publishing',
      ],
      steps: [
        'Create a repo',
        'Open files in an editor',
        'Edit your project',
        'Commit and push changes',
      ],
    },
    {
      id: 'ai-assisted',
      title: 'AI-Assisted Start',
      stack: 'GitHub + Cursor',
      bestFor: [
        'learners who want AI inside the editor',
        'students comfortable prompting',
        'people who want faster iteration with guidance',
      ],
      steps: [
        'Open a repo in Cursor',
        'Ask the editor to explain the project',
        'Request small edits',
        'Review and refine the result',
      ],
    },
  ],
  glossary: [
    { term: 'IDE', definition: 'Your main coding workspace.', analogy: 'A digital workbench.' },
    {
      term: 'Repository / Repo',
      definition: 'A project container where your files live.',
      analogy: 'A studio folder with memory.',
    },
    { term: 'Commit', definition: 'A saved checkpoint of your changes.' },
    { term: 'Branch', definition: 'A separate version of your project for trying changes safely.' },
    { term: 'Push', definition: 'Sending your changes to GitHub.' },
    { term: 'Clone', definition: 'Downloading a repo from GitHub to your computer.' },
    { term: 'Prompt', definition: 'A written instruction you give to an AI tool.' },
    { term: 'Frontend', definition: 'The part of the project the user sees and interacts with.' },
    { term: 'Deploy / Publish', definition: 'Making your site live on the internet.' },
    { term: 'React', definition: 'A way of building interfaces out of reusable components.' },
    { term: 'Next.js', definition: 'A framework for building React-based web apps.' },
  ],
  tools: [
    {
      name: 'CodePen',
      feeling: 'Feels like sketching in public.',
      bestFor: ['fastest start', 'browser-based experiments', 'instant visual feedback'],
      useWhen: ['you want one browser window', 'you want immediate results'],
    },
    {
      name: 'VS Code',
      feeling: 'Feels like a clean studio desk.',
      bestFor: ['structured editing', 'files and folders', 'real project workflows'],
      useWhen: ['you want solid foundations', 'you want flexibility without AI leading everything'],
    },
    {
      name: 'Cursor',
      feeling: 'Feels like a studio desk with a collaborator beside you.',
      bestFor: ['AI-assisted editing', 'codebase explanation', 'faster iteration'],
      useWhen: ['you want AI integrated into the editor', 'you want guided changes'],
    },
    {
      name: 'Claude',
      feeling: 'Feels like a thoughtful creative consultant.',
      bestFor: ['planning', 'explanations', 'prompt refinement'],
      useWhen: ['you want conceptual help before coding', 'you want comparisons or clearer instructions'],
    },
    {
      name: 'Codex',
      feeling: 'Feels like a technical assistant you still need to supervise.',
      bestFor: ['coding tasks', 'agent-style support', 'technical edits'],
      useWhen: ['you are ready to review outputs carefully'],
    },
  ],
  promptPatterns: [
    {
      label: 'Explain',
      example:
        'Explain this project like I am a beginner. What are the main files and what does each one do?',
    },
    {
      label: 'Edit',
      example:
        'Change the page so it feels more like a poetic net art homepage. Keep it simple and explain every change.',
    },
    {
      label: 'Compare',
      example: 'Show me two versions: one minimal and one chaotic.',
    },
    {
      label: 'Refine',
      example: 'Keep the layout, but improve the typography, spacing, and color contrast.',
    },
    {
      label: 'Review',
      example: 'Before changing anything, tell me your plan in 3 steps.',
    },
  ],
  modes: {
    easy: {
      title: 'Easy mode',
      tools: ['CodePen', 'browser editor'],
      steps: [
        'Change text',
        'Change background color',
        'Add one font or spacing choice',
        'Save the link or screenshot',
      ],
      outcome: 'A first browser artifact with almost no setup friction.',
    },
    medium: {
      title: 'Medium mode',
      tools: ['GitHub', 'VS Code'],
      steps: [
        'Create index.html',
        'Create style.css',
        'Add title and paragraph',
        'Style the page',
        'Commit changes',
      ],
      outcome: 'A real project with files, structure, and version history.',
    },
    advanced: {
      title: 'Advanced mode',
      tools: ['GitHub', 'Cursor'],
      steps: [
        'Open the project',
        'Ask Cursor to explain the structure',
        'Ask for a one-page poetic homepage',
        'Review changes',
        'Refine the result',
        'Commit the final version',
      ],
      outcome: 'An AI-assisted project flow with review, refinement, and structure.',
    },
  },
  reflection: [
    'Which starting lane did you choose?',
    'Which tool felt best for you right now?',
    'Which term became clearer today?',
    'What kind of web-based work do you want to make next?',
  ],
}
