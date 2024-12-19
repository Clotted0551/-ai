"use client"

import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { Box, Grid, Typography, Paper } from '@mui/material';

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
    <Box sx={{ width: '100%', height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
      <Grid container spacing={2}>
        {/* Left Section: 위험자산 설명 */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, backgroundColor: '#ffe8e8' }}>
            <Typography variant="h6" gutterBottom>
              위험자산
            </Typography>
            <Typography variant="body2">
              성장주 중심으로 투자하여 높은 수익률을 목표로 하지만 변동성이 큰 자산입니다. 
              주식, 테크 기업, 고위험 펀드 등이 포함됩니다.
            </Typography>
          </Paper>
        </Grid>

        {/* Center Section: 차트 */}
        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ width: '100%', height: 400 }}>
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
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        {/* Right Section: 안전자산 설명 */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, backgroundColor: '#e8f4ff' }}>
            <Typography variant="h6" gutterBottom>
              안전자산
            </Typography>
            <Typography variant="body2">
              안정적인 수익과 원금 보전을 목표로 하는 자산입니다. 금, 채권, 배당주, 
              현금 등이 포함되며, 변동성이 낮고 비교적 안전합니다.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PortfolioChart;
