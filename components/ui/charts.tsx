"use client"

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
  LineProps,
  XAxisProps,
  YAxisProps,
  TooltipProps,
  BarProps,
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
export function Line<T extends object>(props: Omit<LineProps<T>, 'type'> & { type?: 'monotone' | 'linear' }) {
  return <RechartsLine<T> {...props} />
}

// Type-safe wrapper for Bar
export function Bar<T extends object>(props: BarProps<T>) {
  return <RechartsBar<T> {...props} />
}

// Type-safe wrapper for XAxis
export function XAxis<T extends object>(props: XAxisProps<T>) {
  return <RechartsXAxis<T> {...props} />
}

// Type-safe wrapper for YAxis
export function YAxis<T extends object>(props: YAxisProps<T>) {
  return <RechartsYAxis<T> {...props} />
}

// Type-safe wrapper for Tooltip
export function Tooltip<T extends object>(props: Partial<TooltipProps<any, keyof T>>) {
  return <RechartsTooltip<T> {...props} />
}