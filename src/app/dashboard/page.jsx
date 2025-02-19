import HistoryCard from "@/components/dashboard/HistoryCard";
import HotTopicsCard from "@/components/dashboard/HotTopicsCard";
import QuizMeCard from "@/components/dashboard/QuizMeCard";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Dashboard | QuizGenie",
  description: "Quiz yourself on anything!",
};

const Dashboard = async (props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="p-8 mx-auto max-w-7xl bg-[#13151a] min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <QuizMeCard />
        <HistoryCard />
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="md:col-span-1 lg:col-span-4">
          <HotTopicsCard />
        </div>
        <div className="md:col-span-1 lg:col-span-3">
          <RecentActivityCard />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;