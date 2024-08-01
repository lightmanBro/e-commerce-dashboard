import "./Chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Chart = ({ aspect, title, data }) => {
  console.log(data,title,aspect)
  const getColorByValue = (value) => {
    if (value < 100) return "#FF4500"; // Orangered
    if (value >= 100 && value < 1000) return "#FFD700"; // Lemon
    return "#32CD32"; // Green
  };

  const renderCustomizedDot = (props) => {
    const { cx, cy, value } = props;
    const color = getColorByValue(value);
    return (
      <circle cx={cx} cy={cy} r={5} stroke={color} strokeWidth={2} fill={color} />
    );
  };

  return (
    <div className="chart">
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={1} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis
            tickFormatter={(tick) => tick / 1000}
            ticks={[0, 1000, 2000, 3000]} // Adjust ticks as needed
          />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorPv)"
            dot={renderCustomizedDot}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
