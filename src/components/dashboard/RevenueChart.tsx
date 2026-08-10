"use client";

import { AreaChart } from "@tremor/react";

const chartdata = [
  { date: "Jan", Revenue: 110000 },
  { date: "Feb", Revenue: 140000 },
  { date: "Mar", Revenue: 210000 },
  { date: "Apr", Revenue: 280000 },
  { date: "May", Revenue: 160000 },
  { date: "Jun", Revenue: 340000 },
];

export function RevenueChart() {
  const customTooltip = (props: any) => {
    const { payload, active } = props;
    if (!active || !payload) return null;
    return (
      <div className="bg-white border border-gray-100 text-gray-900 text-sm rounded-xl py-2 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <p className="font-medium text-gray-500">{payload[0].payload.date}</p>
        <p className="mt-1">
          <span className="font-semibold text-gray-900">{Intl.NumberFormat("cs-CZ").format(payload[0].value)}</span> CZK
        </p>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-gray-100/50 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
      {/* Definice lineárního gradientu pro výplň Tremor chartu v barvě Obsidian #191919 */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#191919" stopOpacity={0.08} />
            <stop offset="100%" stopColor="#191919" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Custom styl pro přepsání Tremor SVG vrstev */}
      <style>{`
        .recharts-area-area {
          fill: url(#colorRevenue) !important;
          fill-opacity: 1 !important;
        }
        .recharts-line-curve {
          stroke: #191919 !important;
          stroke-width: 2px !important;
          filter: drop-shadow(0px 6px 6px rgba(25, 25, 25, 0.15)) !important;
        }
        .recharts-cartesian-axis-tick-value {
          fill: #6B7280 !important;
          font-size: 12px !important;
        }
        .recharts-cartesian-grid-horizontal line, .recharts-cartesian-grid-vertical line {
          stroke: #F3F4F6 !important;
          stroke-opacity: 0.8;
        }
      `}</style>

      <div className="mb-8">
        <h3 className="text-[15px] font-medium text-gray-900">Vývoj příjmů za sledované období</h3>
      </div>
      
      <AreaChart
        className="h-72 mt-4"
        data={chartdata}
        index="date"
        categories={["Revenue"]}
        colors={["#191919"]}
        valueFormatter={(number: number) => {
          if (number === 0) return "0";
          return `${(number / 1000).toFixed(0)}k`;
        }}
        showAnimation={true}
        showLegend={false}
        curveType="monotone"
        showGridLines={true}
        yAxisWidth={40}
        customTooltip={customTooltip}
      />
    </div>
  );
}
