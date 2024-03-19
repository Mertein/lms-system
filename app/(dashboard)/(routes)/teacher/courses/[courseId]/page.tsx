export default function CourseIdPage({
  params,
}: {
  params: { courseId: string };
}) {
  return <div className="ml-4">{params.courseId}</div>;
}
