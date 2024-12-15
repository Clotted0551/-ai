"use client"

import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { motion } from 'framer-motion';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const COLORS = ['#FF6384', '#36A2EB'];

const PortfolioChart = ({ data }) => {
  const chartData = [
    { name: '위험자산', value: data.위험자산 },
    { name: '안전자산', value: data.안전자산 },
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center w-full h-full max-w-md mx-auto"
    >
      <ChartContainer
        config={{
          위험자산: {
            label: "위험자산",
            color: COLORS[0],
          },
          안전자산: {
            label: "안전자산",
            color: COLORS[1],
          },
        }}
        className="flex justify-center items-center w-full h-[400px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={150}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} />
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </motion.div>
  );
};

export default PortfolioChart;

