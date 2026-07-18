export const GRADES = [
  'Preschool',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Homeschooling with spoken english',
  'PHONICS LEVEL 1'
] as const;

export type Grade = typeof GRADES[number];

export const GRADE_PREFIXES: Record<Grade, string[]> = {
  'Preschool': ['P'],
  'Grade 1': ['G1'],
  'Grade 2': ['G2'],
  'Grade 3': ['G3'],
  'Grade 4': ['G4'],
  'Grade 5': ['G5'],
  'Homeschooling with spoken english': ['HP8', 'HS8', 'HK8'],
  'PHONICS LEVEL 1': ['7P', '7S', '7K']
};
