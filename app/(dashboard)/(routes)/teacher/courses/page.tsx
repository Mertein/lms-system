import { Button } from "@/components/ui/button";
import Link from "next/link";

const CoursesPage = () => {
  return (
    <div className="ml-2">
      <Link href="/teacher/create">
        <Button>Crear Curso</Button>
      </Link>
    </div>
  );
};

export default CoursesPage;
