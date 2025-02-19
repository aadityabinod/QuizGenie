"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { History } from "lucide-react";

const HistoryCard = () => {
  const router = useRouter();
  return (
    <Card
      className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-all cursor-pointer hover:scale-105"
      onClick={() => {
        router.push("/history");
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold text-white">
          History
        </CardTitle>
        <History size={28} strokeWidth={2.5} className="text-green-500" />
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
       
      <p className="text-sm text-muted-foreground">
          View past quiz attempts.
        </p>
      </CardContent>
    </Card>
  );
};

export default HistoryCard;