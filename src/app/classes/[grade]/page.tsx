import GradePageContent from '@/components/classes/GradePageContent';
import { syllabusData } from '@/data/syllabus';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ grade: string }>;
}

export async function generateStaticParams() {
  return Object.keys(syllabusData).map((grade) => ({
    grade: grade,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { grade } = await params;
  const data = syllabusData[grade];

  if (!data) {
    return {
      title: 'Grade Not Found - NadeeTeacher',
      description: 'The grade you are looking for does not exist.',
    };
  }

  return {
    title: `${data.title} Syllabus - NadeeTeacher`,
    description: `Explore the ${data.title} syllabus: ${data.description}. Join NadeeTeacher for interactive online classes.`,
    openGraph: {
      title: `${data.title} Syllabus - NadeeTeacher`,
      description: data.description,
      images: data.image ? [{ url: data.image }] : [],
    },
  };
}

export default async function GradePage({ params }: Props) {
  const { grade } = await params;
  const data = syllabusData[grade];

  return <GradePageContent data={data || null} />;
}
