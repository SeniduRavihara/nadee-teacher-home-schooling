export const GRADES = [
  'Preschool',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5'
] as const;

export type Grade = typeof GRADES[number];
