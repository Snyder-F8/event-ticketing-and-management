import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function Chart({ data, title }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow border border-[#CFE0FD]">
      <h3 className="font-semibold mb-3 text-[#03193E]">{title}</h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#1B6CF5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}