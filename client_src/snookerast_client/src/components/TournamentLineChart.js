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

const dataKeyBase = "avg_ast";
const dataKeyMap = {
  "0" : dataKeyBase + "1",
  "1" : dataKeyBase + "2",
  "2" : dataKeyBase + "3",
  "3" : dataKeyBase + "4",
}

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
          {Array(props.noOfLines).fill(true).map((_, i) => <Line
                                                              key={i}
                                                              type="monotone"
                                                              dataKey={dataKeyMap[i.toString()]}
                                                              stroke="#8884d8" 
                                                              activeDot={{ r: 8 }} />)}
        </LineChart>
    </div>
  );
}
