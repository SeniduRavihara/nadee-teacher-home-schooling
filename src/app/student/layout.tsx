import StudentLayoutContent from '@/components/student/StudentLayoutContent';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudentLayoutContent>
      {children}
    </StudentLayoutContent>
  );
}
