import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { DashboardStats } from '../../types/dashboard'
import { Panel } from './Panel'

interface TrendChartProps {
  dailySessions: DashboardStats['dailySessions']
}

export function TrendChart({ dailySessions }: TrendChartProps) {
  return (
    <Panel title="Sessions this week" eyebrow="7-day trend">
      <div className="h-[245px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dailySessions} margin={{ top: 10, right: 8, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="sageFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f7d63" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#4f7d63" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#e8e9e4" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7570', fontSize: 12 }} dy={8} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7570', fontSize: 12 }} />
            <Tooltip contentStyle={{ border: '1px solid #e8e9e4', borderRadius: 10 }} />
            <Area type="monotone" dataKey="count" stroke="#4f7d63" strokeWidth={2.5} fill="url(#sageFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}