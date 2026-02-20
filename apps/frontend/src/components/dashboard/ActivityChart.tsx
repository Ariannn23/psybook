import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ActivityChartProps {
  data: Array<{
    day: number;
    dayName: string;
    count: number;
  }>;
}

export default function ActivityChart({ data }: ActivityChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-300 animate-fade-in">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Citas por Día de la Semana
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="dayName" 
            stroke="#64748b"
            tick={{ fill: "#64748b", fontSize: 12 }}
          />
          <YAxis 
            stroke="#64748b"
            tick={{ fill: "#64748b", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "8px 12px",
            }}
            labelStyle={{ fontWeight: 600, color: "#1e293b" }}
          />
          <Bar 
            dataKey="count" 
            fill="#10b981"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
