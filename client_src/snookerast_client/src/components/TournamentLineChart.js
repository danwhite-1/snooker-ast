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

const dataKeyColours = {
  "0" : "#2596be",
  "1" : "#9925be",
  "2" : "#be4d25",
  "3" : "#49be25",
}

export default function TournamentLineChart(props) {
  return (
    <div className="TournamentLineChartDiv rounded">
        <LineChart
          key={`lc_${props.data.length}`}
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
          <CartesianGrid key={`cg_${props.data.length}`} strokeDasharray="10 10" />
          <XAxis key={`x_${props.data.length}`} dataKey="round" />
          <YAxis key={`y_${props.data.length}`} />
          <Tooltip key={`tt_${props.data.length}`} />
          <Legend key={`l_${props.data.length}`} />
          {Array(props.tournNames.length).fill(true).map((_, i) => <Line
                                                              key={i}
                                                              type="monotone"
                                                              dataKey={props.tournNames[i]}
                                                              stroke={dataKeyColours[i.toString()]}
                                                              activeDot={{ r: 8 }} />)}
        </LineChart>
    </div>
  );
}
