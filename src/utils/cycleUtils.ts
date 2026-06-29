import { CycleStatusResponse, Period } from '../services/api';

export function formatDaysUntilPeriodStat(days: number): {
  label: string;
  detail: string;
} {
  if (days < 0) {
    const overdueDays = Math.abs(days);
    return {
      label: 'Late',
      detail: `${overdueDays} day${overdueDays === 1 ? '' : 's'} overdue`,
    };
  }
  if (days === 0) {
    return { label: 'Today', detail: 'Period expected' };
  }
  if (days === 1) {
    return { label: '1', detail: 'Day until period' };
  }
  return { label: String(days), detail: 'Days until period' };
}

/**
 * Check if today falls within any logged period (actual data)
 */
export function isInLoggedPeriod(today: Date, periods: Period[]): boolean {
  const todayDate = new Date(today);
  todayDate.setHours(0, 0, 0, 0);

  return periods.some(period => {
    const start = new Date(period.startDate);
    start.setHours(0, 0, 0, 0);

    // If period doesn't have end date, it's ongoing - check if today >= start
    if (!period.endDate) {
      return todayDate >= start;
    }

    const end = new Date(period.endDate);
    end.setHours(0, 0, 0, 0);

    return todayDate >= start && todayDate <= end;
  });
}

/**
 * Check if we're past expected next period date (prediction)
 */
export function isPastExpectedPeriod(
  lastPeriodStartDate: Date | null,
  averageCycleLength: number,
  today: Date,
): boolean {
  if (!lastPeriodStartDate) {
    return false;
  }

  const lastStart = new Date(lastPeriodStartDate);
  lastStart.setHours(0, 0, 0, 0);

  const expectedNextPeriod = new Date(lastStart);
  expectedNextPeriod.setDate(expectedNextPeriod.getDate() + averageCycleLength);
  expectedNextPeriod.setHours(0, 0, 0, 0);

  const todayDate = new Date(today);
  todayDate.setHours(0, 0, 0, 0);

  return todayDate > expectedNextPeriod;
}

/**
 * Main function: determines if current phase is predicted or actual
 * @returns { isPredicted: boolean, reason: string | null }
 */
export function getPhaseDataStatus(
  cycleStatus: CycleStatusResponse['data'] | null,
  periods: Period[],
): { isPredicted: boolean; reason: string | null } {
  if (!cycleStatus || !cycleStatus.isTracking) {
    return { isPredicted: true, reason: 'not_tracking' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Log input data for debugging
  console.log('=== getPhaseDataStatus Debug ===');
  console.log('Today:', today.toISOString());
  console.log('cycleStatus.lastPeriodStartDate:', cycleStatus.lastPeriodStartDate);
  console.log('cycleStatus.averageCycleLength:', cycleStatus.averageCycleLength);
  console.log('cycleStatus.cycleDay:', cycleStatus.cycleDay);
  console.log('periods count:', periods.length);
  console.log('periods:', periods.map(p => ({
    startDate: p.startDate,
    endDate: p.endDate,
  })));

  // Check 1: Is today within a logged period? (ACTUAL data)
  const inLoggedPeriod = isInLoggedPeriod(today, periods);
  console.log('isInLoggedPeriod:', inLoggedPeriod);
  
  if (inLoggedPeriod) {
    console.log('Result: ACTUAL (in logged period)');
    return { isPredicted: false, reason: null };
  }

  // Check 1.5: If period is late (daysUntilNextPeriod < 0), it's PREDICTED
  const daysUntilNextPeriod = cycleStatus.daysUntilNextPeriod;
  console.log('daysUntilNextPeriod:', daysUntilNextPeriod);
  
  if (typeof daysUntilNextPeriod === 'number' && daysUntilNextPeriod < 0) {
    console.log('Result: PREDICTED (period is late/overdue)');
    return { isPredicted: true, reason: 'period_late' };
  }

  // Check 2: Are we past expected next period date? (PREDICTION)
  if (cycleStatus.lastPeriodStartDate) {
    const avgCycleLength = cycleStatus.averageCycleLength || 28;
    const lastPeriodStart = new Date(cycleStatus.lastPeriodStartDate);
    lastPeriodStart.setHours(0, 0, 0, 0);
    
    // Calculate cycle end date (last period start + cycle length)
    const cycleEndDate = new Date(lastPeriodStart);
    cycleEndDate.setDate(cycleEndDate.getDate() + avgCycleLength);
    cycleEndDate.setHours(0, 0, 0, 0);
    
    // Calculate expected next period date (same as cycle end date for first check)
    const expectedNextPeriod = new Date(lastPeriodStart);
    expectedNextPeriod.setDate(expectedNextPeriod.getDate() + avgCycleLength);
    expectedNextPeriod.setHours(0, 0, 0, 0);
    
    // Check if cycleDay indicates cycle has ended
    const cycleDay = cycleStatus.cycleDay || 0;
    const isCycleEnded = cycleDay > avgCycleLength;
    
    console.log('lastPeriodStart:', lastPeriodStart.toISOString());
    console.log('cycleEndDate (lastPeriodStart + cycleLength):', cycleEndDate.toISOString());
    console.log('expectedNextPeriod:', expectedNextPeriod.toISOString());
    console.log('cycleDay:', cycleDay);
    console.log('averageCycleLength:', avgCycleLength);
    console.log('isCycleEnded (cycleDay > avgCycleLength):', isCycleEnded);
    console.log('today > cycleEndDate:', today > cycleEndDate);
    console.log('today > expectedNextPeriod:', today > expectedNextPeriod);
    
    // If cycleDay exceeds averageCycleLength, the cycle has ended - this is PREDICTED
    if (isCycleEnded) {
      console.log('Result: PREDICTED (cycleDay > averageCycleLength - cycle has ended)');
      return { isPredicted: true, reason: 'cycle_ended' };
    }
    
    // If we're past the expected next period date, it's a prediction
    if (isPastExpectedPeriod(lastPeriodStart, avgCycleLength, today)) {
      console.log('Result: PREDICTED (past expected next period)');
      return { isPredicted: true, reason: 'past_expected_date' };
    }

    // If we're past the cycle end date (lastPeriodStart + cycleLength) but not past expected next period,
    // we're still in a prediction zone (cycle has ended, waiting for next period)
    if (today > cycleEndDate) {
      console.log('Result: PREDICTED (past cycle end date)');
      return { isPredicted: true, reason: 'past_cycle_end' };
    }

    // If we have lastPeriodStartDate and we're within the cycle length,
    // and we're not in a logged period, we're still in the cycle (ACTUAL)
    console.log('Result: ACTUAL (within cycle, not in logged period)');
    return { isPredicted: false, reason: null };
  }

  // No period data at all - this is a prediction
  console.log('Result: PREDICTED (no period data)');
  return { isPredicted: true, reason: 'no_period_data' };
}
