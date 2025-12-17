

export interface Module {
  title: string;
  description: string;
  icon: any; // We'll need to handle the icons carefully as they act like components
}

export interface Syllabus {
  title: string;
  description: string;
  color: string;
  image?: string;
  modules: Module[];
}

export const syllabusData: Record<string, Syllabus> = {
  'preschool': {
    title: 'Preschool',
    description: 'ABC & First Words',
    color: 'from-pink-400 to-rose-500',
    image: '/pre.jpg',
    modules: [
      { title: 'Phonics Fun', description: 'Learning letter sounds and simple blends.', icon: 'Music' },
      { title: 'My First Words', description: 'Building essential vocabulary.', icon: 'Star' },
      { title: 'Nursery Rhymes', description: 'Singing and learning rhythm.', icon: 'Music' },
      { title: 'Speaking Basics', description: 'Simple greetings and introductions.', icon: 'Globe' },
    ]
  },
  'grade-1': {
    title: 'Grade 1',
    description: 'Phonics & Reading Begins',
    color: 'from-orange-400 to-amber-500',
    image: '/grade1.jpg',
    modules: [
      { title: 'Advanced Phonics', description: 'Digraphs, blends, and reading rules.', icon: 'BookOpen' },
      { title: 'Sight Words', description: 'Recognizing common words instantly.', icon: 'Star' },
      { title: 'Simple Sentences', description: 'Reading and framing basic sentences.', icon: 'BookOpen' },
      { title: 'Story Time', description: 'Listening to and understanding stories.', icon: 'Music' },
    ]
  },
  'grade-2': {
    title: 'Grade 2',
    description: 'Grammar & Storytelling',
    color: 'from-green-400 to-emerald-500',
    image: '/grade2.jpg',
    modules: [
      { title: 'Grammar Starter', description: 'Nouns, verbs, and adjectives.', icon: 'BookOpen' },
      { title: 'Reading Fluency', description: 'Reading with expression and speed.', icon: 'BookOpen' },
      { title: 'Creative Writing', description: 'Writing short paragraphs and stories.', icon: 'Star' },
      { title: 'Conversation', description: 'Asking questions and answering.', icon: 'Globe' },
    ]
  },
  'grade-3': {
    title: 'Grade 3',
    description: 'Reading & Comprehension',
    color: 'from-cyan-400 to-blue-500',
    modules: [
      { title: 'Comprehension', description: 'Understanding texts and answering questions.', icon: 'BookOpen' },
      { title: 'Parts of Speech', description: 'Deep dive into grammar rules.', icon: 'BookOpen' },
      { title: 'Vocabulary Builder', description: 'Synonyms, antonyms, and new words.', icon: 'Star' },
      { title: 'Public Speaking', description: 'Presenting ideas confidently.', icon: 'Globe' },
    ]
  },
  'grade-4': {
    title: 'Grade 4',
    description: 'Writing & Expression',
    color: 'from-purple-400 to-violet-500',
    modules: [
      { title: 'Essay Writing', description: 'Structuring essays and letters.', icon: 'BookOpen' },
      { title: 'Tenses Masterclass', description: 'Past, present, and future tenses.', icon: 'Clock' },
      { title: 'Poetry & Prose', description: 'Appreciating different forms of text.', icon: 'Music' },
      { title: 'Debating Skills', description: 'Expressing opinions and arguments.', icon: 'Award' },
    ]
  },
  'grade-5': {
    title: 'Grade 5',
    description: 'Scholarship & Advanced',
    color: 'from-indigo-400 to-blue-600',
    modules: [
      { title: 'Scholarship Prep', description: 'Targeted practice for exams.', icon: 'Award' },
      { title: 'Advanced Grammar', description: 'Complex sentences and active/passive voice.', icon: 'BookOpen' },
      { title: 'Reading Analysis', description: 'Critical thinking and textual analysis.', icon: 'Globe' },
      { title: 'Effective Communication', description: 'Professional speaking and writing.', icon: 'Star' },
    ]
  },
};
