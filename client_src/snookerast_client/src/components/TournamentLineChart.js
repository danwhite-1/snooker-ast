import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

export default function TournamentLineChart(props) {
  return (
    <div className="TournamentLineChartDiv rounded">
        <LineChart
        className="TournamentLineChart"
        width={900}
        height={600}
        data={props.data}
        margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
        }}
        >
        <CartesianGrid strokeDasharray="10 10" />
        <XAxis dataKey="round" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="avg_ast" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
    </div>
  );
}
