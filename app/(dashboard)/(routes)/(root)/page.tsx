import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CourseList } from "@/components/course-list";
import { auth } from "@clerk/nextjs";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import { InfoCard } from "./_components/info-card";

const Dashboard = async () => {
  const { userId } = auth();
  if (!userId) return redirect("/");
  const { completedCourses, coursesInProgress } =
    await getDashboardCourses(userId);
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="En Progreso"
          numberOfItems={coursesInProgress.length}
          variant={"default"}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completados"
          numberOfItems={completedCourses.length}
          variant={"success"}
        />
      </div>
      <CourseList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
};

export default Dashboard;
