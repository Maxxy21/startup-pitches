"use client"

import { useEffect, useState } from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { motion } from 'framer-motion';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface RadarChartProps {
  data: Array<{
    criteria: string;
    score: number;
  }>;
}

export const ScoreRadarChart = ({ data }: RadarChartProps) => {
  const [chartData, setChartData] = useState<Array<{ category: string; score: number }>>([]);

  useEffect(() => {
    // Format data for the radar chart
    const formattedData = data.map(item => ({
      category: item.criteria,
      score: 0, // Start at 0 for animation
    }));
    
    setChartData(formattedData);
    
    // Trigger animation after a small delay
    const timer = setTimeout(() => {
      setChartData(data.map(item => ({
        category: item.criteria,
        score: item.score,
      })));
    }, 500);
    
    return () => clearTimeout(timer);
  }, [data]);

  const chartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="items-center pb-4">
          <CardTitle>Score Distribution</CardTitle>
          <CardDescription>
            Showing performance across all evaluation categories
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <RadarChart data={chartData}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarAngleAxis dataKey="category" />
              <PolarGrid />
              <Radar
                dataKey="score"
                fill="var(--color-score)"
                fillOpacity={0.6}
                animationDuration={1000}
                animationEasing="ease-out"
                isAnimationActive={true}
              />
            </RadarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 