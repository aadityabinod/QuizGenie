import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import QuizCreation from "@/components/forms/QuizCreation";

export const metadata = {
  title: "Quiz | Quizzzy",
  description: "Quiz yourself on anything!",
};

const Quiz = async ({ searchParams }) => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/");
  }

  // Ensure that searchParams is properly awaited
  const topic = searchParams?.topic || ""; // Directly access topic

  return <QuizCreation topic={topic} />;
};

export default Quiz;