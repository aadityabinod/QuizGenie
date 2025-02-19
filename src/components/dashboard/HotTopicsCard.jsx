import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import WordCloud from "../WordCloud";
import prisma from "@/lib/db";

const HotTopicsCard = async (props) => {
  const topics = await prisma.topic_count.findMany({});
  const formattedTopics = topics.map((topic) => {
    return {
      text: topic.topic,
      value: topic.count,
    };
  });

  return (
    <Card className=" col-span-4 bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">
          Hot Topics
        </CardTitle>
        <CardDescription className="text-gray-400">
          Click on a topic to start a quiz on it.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        {/* <WordCloud formattedTopics={formattedTopics} /> */}
        <div className="text-white">Cloud</div>
      </CardContent>
    </Card>
  );
};

export default HotTopicsCard;