import moment from 'moment';
import { colors } from '../../constants/colors';
import {
  CycleStatusResponse,
  Period,
  PeriodAnalyticsResponse,
} from '../../services/api';
import { PHASE_NAMES, PHASE_TAGLINES } from './cycleInsightConstants';

type CycleData = CycleStatusResponse['data'];
type AnalyticsData = PeriodAnalyticsResponse['data'];

export function getPhaseDisplayName(phase?: string): string {
  if (!phase) return 'Unknown Phase';
  return (
    PHASE_NAMES[phase] ||
    phase.charAt(0).toUpperCase() + phase.slice(1) + ' Phase'
  );
}

export function getCycleDayText(cycle?: CycleData | null): string {
  if (!cycle?.cycleDay) return 'Day 0';
  return `Day ${cycle.cycleDay}`;
}

export function getFertilityTagline(
  cycle?: CycleData | null,
  phase?: string,
): string {
  if (cycle?.fertilityLevel === 'high') return 'High';
  if (cycle?.fertilityLevel === 'medium') return 'Medium';
  if (cycle?.fertilityLevel === 'low') return 'Low';

  if (phase && PHASE_TAGLINES[phase]) {
    return PHASE_TAGLINES[phase];
  }

  return 'Fertility awareness';
}

export function getFertileWindowText(
  cycle?: CycleData | null,
  lastPeriodStart?: Date | null,
): string {
  if (cycle?.fertileWindowStart && cycle?.fertileWindowEnd) {
    const start = moment(cycle.fertileWindowStart).format('MMM D');
    const end = moment(cycle.fertileWindowEnd).format('MMM D');
    return `${start} – ${end}`;
  }

  if (!lastPeriodStart) return 'Fertile window not available';

  const fertileStart = moment(lastPeriodStart).clone().add(9, 'days');
  const fertileEnd = moment(lastPeriodStart).clone().add(14, 'days');

  return `${fertileStart.format('MMM D')} – ${fertileEnd.format('MMM D')}`;
}

export function getFertilityDescription(cycle?: CycleData | null): string {
  if (cycle?.fertilityDescription) {
    return cycle.fertilityDescription;
  }

  switch (cycle?.phase) {
    case 'menstrual':
      return 'Fertility is low while your body focuses on shedding the uterine lining and resetting for a new cycle.';
    case 'follicular':
      return 'Your fertile window is approaching. Hormones are rising and your body is preparing for ovulation.';
    case 'ovulatory':
      return 'You are near or at ovulation. This is typically the most fertile time of your cycle.';
    case 'luteal':
      return 'Ovulation has likely passed. Hormones shift toward progesterone, and fertility usually decreases.';
    default:
      return 'Track your cycle regularly to understand your unique fertile window and patterns.';
  }
}

export function getNextPeriodText(cycle?: CycleData | null): string {
  if (
    cycle?.daysUntilNextPeriod === null ||
    cycle?.daysUntilNextPeriod === undefined
  ) {
    return 'Unknown';
  }
  const days = cycle.daysUntilNextPeriod;
  if (days < 0) return `Overdue by ${Math.abs(days)} days`;
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `${days} days`;
}

export function formatPeriodRange(period: Period): string {
  const start = moment(period.startDate).format('MMM D, YYYY');
  if (!period.endDate) {
    return `${start} – ongoing`;
  }
  const end = moment(period.endDate).format('MMM D, YYYY');
  return `${start} – ${end}`;
}

export function getPeriodLengthLabel(period: Period): string {
  if (!period.endDate) return 'In progress';
  const start = moment(period.startDate).startOf('day');
  const end = moment(period.endDate).startOf('day');
  const days = end.diff(start, 'days') + 1;
  return `${days} day${days === 1 ? '' : 's'}`;
}

export function getRegularityLabel(cycle?: CycleData | null): string {
  if (!cycle?.regularityClassification) return '';
  const labels: Record<string, string> = {
    very_regular: 'Very Regular',
    regular: 'Regular',
    irregular: 'Irregular',
    very_irregular: 'Very Irregular',
    insufficient_data: 'Need More Data',
  };
  return labels[cycle.regularityClassification || ''] || '';
}

export function getDataQualityLabel(cycle?: CycleData | null): string {
  if (!cycle?.dataQuality) return '';
  const labels: Record<string, string> = {
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    needs_improvement: 'Needs Improvement',
  };
  return labels[cycle.dataQuality || ''] || '';
}

export function getDataQualityColor(cycle?: CycleData | null): string {
  if (!cycle?.dataQuality) return colors.darkGrey;
  const colors_map: Record<string, string> = {
    excellent: colors.green,
    good: '#4CAF50',
    fair: colors.heading,
    needs_improvement: '#F44336',
  };
  return colors_map[cycle.dataQuality || ''] || colors.darkGrey;
}

export function getTrimesterText(tri?: number): string {
  if (!tri) return '';
  switch (tri) {
    case 1:
      return 'First Trimester';
    case 2:
      return 'Second Trimester';
    case 3:
      return 'Third Trimester';
    default:
      return '';
  }
}

export function getDaysText(days: number | null | undefined): string {
  if (days === null || days === undefined) return '—';
  if (days > 0) return `${days} days to go`;
  if (days === 0) return 'Due date is today!';
  return `${Math.abs(days)} days past due date`;
}

export function hasAnalyticsData(
  analyticsData?: AnalyticsData | null,
): analyticsData is AnalyticsData {
  return !!(
    analyticsData &&
    analyticsData.totalPeriods &&
    analyticsData.totalPeriods > 0
  );
}
