import { UserButton } from "@clerk/nextjs";
import Sidebar from "./_componentes/sidebar";

export default function HomePage() {
  return (
    <div className="flex bg-zinc-800 w-full h-full ">
      <div className="hidden md:flex h-full flex-col ">
        <Sidebar />
      </div>
      <div className="m-auto p-2">
        <p className="font-semibold text-4xl">My Page to LMS go to play Now!</p>
      </div>
      <UserButton />
    </div>
  );
}
