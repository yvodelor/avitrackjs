import React from 'react';
import ReactECharts from 'echarts-for-react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Thermometer, 
  Droplet, 
  Scale, 
  Wind,
  HelpCircle,

} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';
export type MetricType = 'temperature' | 'humidity' | 'weight' | 'ammonia';

export interface MetricGaugeCardProps {
  title: string;
  metricType?: MetricType;
  current: number;
  min: number;
  max: number;
  gaugeMin?: number;
  gaugeMax?: number;
  unit?: string;
  warningMargin?: number;
  customIcon?: LucideIcon;
  message?: string
}

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: LucideIcon;
  message: string;
}

const ICON_MAP: Record<MetricType, LucideIcon> = {
  temperature: Thermometer,
  humidity: Droplet,
  weight: Scale,
  ammonia: Wind,
};

export const MetricGaugeCard: React.FC<MetricGaugeCardProps> = ({
  title,
  metricType = 'temperature',
  current,
  min,
  max,
  gaugeMin = 0,
  gaugeMax = 100,
  unit = '',
  warningMargin = 5,
  customIcon,
  message = ''
}) => {

  // 1. Calcul dynamique du statut et des styles Tailwind associés
  const getStatusConfig = (): StatusConfig => {
    if (current > max || current < min) {
      return {
        label: 'Danger',
        color: '#EF4444',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300',
        textColor: 'text-red-600',
        icon: Flame,
        message: current > max ? 'Valeur supérieure au max !' : 'Valeur inférieure au min !'
      };
    } 
    if (current >= max - warningMargin || current <= min + warningMargin) {
      return {
        label: 'Warning',
        color: '#F59E0B',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-300',
        textColor: 'text-amber-600',
        icon: AlertTriangle,
        message: 'Seuil limite en approche.'
      };
    }
    return {
      label: 'Normal',
      color: '#10B981',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-300',
      textColor: 'text-emerald-600',
      icon: CheckCircle2,
      message: 'Valeur dans la plage optimale.'
    };
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;
  const HeaderIcon = customIcon || ICON_MAP[metricType] || HelpCircle;

  // 2. Option ECharts
  const option = {
    series: [
      {
        type: 'gauge',
        center: ['50%', '60%'],
        startAngle: 200,
        endAngle: -20,
        min: gaugeMin,
        max: gaugeMax,
        splitNumber: 5,
        itemStyle: { color: status.color },
        progress: { show: true, width: 12, roundCap: true },
        pointer: { show: true, length: '60%', width: 6 },
        axisLine: {
          lineStyle: { width: 12, color: [[1, 'rgba(229, 231, 235, 0.5)']] }
        },
        axisTick: { distance: -18, splitNumber: 2, lineStyle: { width: 1, color: '#9CA3AF' } },
        splitLine: { distance: -22, length: 8, lineStyle: { width: 2, color: '#9CA3AF' } },
        axisLabel: { distance: -12, color: '#6B7280', fontSize: 10 },
        anchor: {
          show: true,
          showAbove: true,
          size: 12,
          itemStyle: { borderWidth: 3, borderColor: status.color }
        },
        detail: {
          valueAnimation: true,
          fontSize: 24,
          fontWeight: 'bold',
          offsetCenter: [0, '35%'],
          formatter: `{value} ${unit}`,
          color: '#1F2937'
        },
        data: [{ value: current }]
      },
      // Pointeur MIN
      {
        type: 'gauge',
        center: ['50%', '60%'],
        startAngle: 200,
        endAngle: -20,
        min: gaugeMin,
        max: gaugeMax,
        pointer: { show: true, length: '90%', width: 3, itemStyle: { color: '#3B82F6' } },
        progress: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: { show: false },
        data: [{ value: min }]
      },
      // Pointeur MAX
      {
        type: 'gauge',
        center: ['50%', '60%'],
        startAngle: 200,
        endAngle: -20,
        min: gaugeMin,
        max: gaugeMax,
        pointer: { show: true, length: '90%', width: 3, itemStyle: { color: '#DC2626' } },
        progress: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: { show: false },
        data: [{ value: max }]
      }
    ]
  };

  return (
    <div className="w-full w-full mx-auto bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
      {/* En-tête */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <HeaderIcon className="w-5 h-5" style={{ color: status.color }} />
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        </div>
        <span className="text-[11px] font-medium bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
          En direct
        </span>
      </div>

      {/* Graphique */}
      <div className="-mt-2">
        <ReactECharts option={option} style={{ height: '210px', width: '100%' }} />
      </div>

      {/* Légende Min / Max */}
      <div className="flex justify-around text-xs text-gray-600 -mt-3 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Min: <strong className="text-gray-900">{min} {unit}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-600" />
          <span>Max: <strong className="text-gray-900">{max} {unit}</strong></span>
        </div>
      </div>

      {/* Footer Statut avec classes Tailwind */}
      <div className={`flex items-center gap-3 p-3 rounded-xl border ${status.bgColor} ${status.borderColor} transition-colors duration-200`}>
        <StatusIcon className={`w-5 h-5 flex-shrink-0 ${status.textColor}`} />
        <div className="flex flex-col">
          <span className={`text-sm font-bold ${status.textColor}`}>
            Statut : {status.label}
          </span>
          <span className="text-[11px] text-gray-500 font-medium">
            {message}
          </span>
        </div>
      </div>
    </div>
  );
};