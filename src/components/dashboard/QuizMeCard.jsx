"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { BrainCircuit } from "lucide-react";

const QuizMeCard = (props) => {
  const router = useRouter();
  return (
    <Card
      className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-all cursor-pointer hover:scale-105"
      onClick={() => {
        router.push("/quiz");
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold text-white">
          Quiz me!
        </CardTitle>
        <BrainCircuit size={28} strokeWidth={2.5} className="text-green-500" />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400">
          Challenge yourself to a quiz with a topic of your choice.
        </p>
      </CardContent>
    </Card>
  );
};

export default QuizMeCard;