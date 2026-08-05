import moment from 'moment';
import { colors } from '../../constants/colors';

export function getPhaseDisplayName(phase?: string): string {
  if (!phase || phase === 'unknown') return 'Unknown';
  return phase.charAt(0).toUpperCase() + phase.slice(1);
}

export function getEnergyLevelText(energyLevel?: string | null): string {
  if (!energyLevel) return '—';
  switch (energyLevel) {
    case 'low':
      return 'Low - Rest';
    case 'rising':
      return 'Rising - High';
    case 'high':
      return 'High - Peak';
    case 'declining':
      return 'Declining - Medium';
    default:
      return '—';
  }
}

export function getSymptomSeverityColor(severity?: string): string {
  switch ((severity || '').toLowerCase()) {
    case 'severe':
    case 'low':
    case 'poor':
      return '#E85C5C';
    case 'moderate':
    case 'medium':
    case 'neutral':
    case 'fair':
      return '#E68C3A';
    case 'mild':
    case 'high':
    case 'good':
      return '#5DBB63';
    default:
      return colors.darkGrey;
  }
}

export function getTrendLabel(
  trend: 'increasing' | 'decreasing' | 'stable' | null,
): string {
  if (trend === 'decreasing') return 'Improving';
  if (trend === 'increasing') return 'Worsening';
  if (trend === 'stable') return 'Stable';
  return '—';
}

export function formatDuration(minutes: number | null): string {
  if (!minutes || minutes <= 0) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatTime(isoTime?: string | null): string {
  if (!isoTime) return '—';
  const dt = new Date(isoTime);
  if (Number.isNaN(dt.getTime())) return '—';
  return moment(dt).format('h:mm A');
}

export function getSleepQualityMeta(quality: number | null): {
  label: string;
  textColor: string;
  bgColor: string;
} {
  if (!quality || quality <= 0) {
    return { label: '—', textColor: colors.darkGrey, bgColor: '#F3F3F3' };
  }
  // Sleep quality is on a 1-5 scale where 5 is best.
  if (quality >= 5) {
    return { label: 'Excellent', textColor: '#2E7D32', bgColor: '#E8F5E9' };
  }
  if (quality >= 4) {
    return { label: 'Good', textColor: '#5A8F29', bgColor: '#F1F8E9' };
  }
  if (quality >= 3) {
    return { label: 'Okay', textColor: '#E68C3A', bgColor: '#FFF3E0' };
  }
  if (quality >= 2) {
    return { label: 'Poor', textColor: '#D35400', bgColor: '#FDEBD0' };
  }
  return { label: 'Very Poor', textColor: '#C62828', bgColor: '#FFEBEE' };
}
