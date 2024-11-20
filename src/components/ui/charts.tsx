import React from "react"
import {
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer as RechartsResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
} from 'recharts'

type ChartProps<T> = {
  data: T[]
  children?: React.ReactNode
}

// Export the components that don't need wrapping
export const CartesianGrid = RechartsCartesianGrid
export const ResponsiveContainer = RechartsResponsiveContainer

// Type-safe wrapper for LineChart
export function LineChart<T extends object>({ data, children, ...props }: ChartProps<T> & Omit<React.ComponentProps<typeof RechartsLineChart>, 'data'>) {
  return (
    <RechartsLineChart data={data} {...props}>
      {children}
    </RechartsLineChart>
  )
}

// Type-safe wrapper for BarChart
export function BarChart<T extends object>({ data, children, ...props }: ChartProps<T> & Omit<React.ComponentProps<typeof RechartsBarChart>, 'data'>) {
  return (
    <RechartsBarChart data={data} {...props}>
      {children}
    </RechartsBarChart>
  )
}

// Type-safe wrapper for Line
export const Line = RechartsLine

// Type-safe wrapper for Bar
export const Bar = RechartsBar

// Type-safe wrapper for XAxis
export const XAxis = RechartsXAxis

// Type-safe wrapper for YAxis
export const YAxis = RechartsYAxis

// Type-safe wrapper for Tooltip
export const Tooltip = RechartsTooltip