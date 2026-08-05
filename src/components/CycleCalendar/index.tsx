import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Modal,
  Alert,
} from 'react-native';
import moment from 'moment';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import images from '../../constants/images';

type PhaseType = 'Menstrual' | 'Follicular' | 'Ovulatory' | 'Luteal';

type CycleCalendarProps = {
  periodStart: Date | null;
  cycleLength?: number;
  periodLength?: number;
  periods?: Array<{
    _id: string;
    startDate: string;
    endDate?: string; // Optional - period might not have ended yet
  }>;
  currentPhase?:
    | 'menstrual'
    | 'follicular'
    | 'ovulatory'
    | 'luteal'
    | 'unknown';
  cycleDay?: number;
  onLogPeriodStart?: (date: Date) => void;
  onLogPeriodEnd?: (date: Date) => void;
  onViewPeriodDetails?: (date: Date) => void;
};

const PHASE_COLORS: Record<PhaseType, string> = {
  Menstrual: '#FFF0F3',
  Follicular: '#FFF2DD',
  Ovulatory: '#E4AF5D',
  Luteal: '#F6F6F6',
};

export default function CycleCalendar({
  periodStart,
  cycleLength = 28,
  periodLength = 5,
  periods = [],
  currentPhase,
  cycleDay,
  onLogPeriodStart,
  onLogPeriodEnd,
  onViewPeriodDetails,
}: CycleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);

  const startOfMonth = currentMonth.clone().startOf('month');
  const daysInMonth = currentMonth.daysInMonth();
  const startDay = startOfMonth.day();
  const today = moment().startOf('day');

  // Use the most recent period start if available, otherwise use the prop
  const latestPeriodStart =
    periods.length > 0
      ? moment(periods[0].startDate)
      : periodStart
      ? moment(periodStart)
      : null;

  const cycleData = {
    periodStart: latestPeriodStart || moment(),
    periodLength: periodLength,
    cycleLength: cycleLength,
  };

  const buildPhases = () => {
    const periodStart = cycleData.periodStart.clone();
    const periodEnd = periodStart
      .clone()
      .add(cycleData.periodLength - 1, 'day');

    const ovulationDay = periodStart.clone().add(14, 'day');

    const follicularStart = periodEnd.clone().add(1, 'day');
    const follicularEnd = ovulationDay.clone().subtract(1, 'day');

    const lutealStart = ovulationDay.clone().add(1, 'day');
    const lutealEnd = periodStart.clone().add(cycleData.cycleLength - 1, 'day');

    return {
      Menstrual: [periodStart, periodEnd],
      Follicular: [follicularStart, follicularEnd],
      Ovulatory: [ovulationDay, ovulationDay],
      Luteal: [lutealStart, lutealEnd],
    };
  };

  const phases = buildPhases();

  // Check if a date is within a logged period
  const isPeriodDate = (date: moment.Moment): boolean => {
    return periods.some(period => {
      const start = moment(period.startDate).startOf('day');
      // If period doesn't have endDate yet, only check if date matches startDate
      if (!period.endDate) {
        return date.isSame(start, 'day');
      }
      const end = moment(period.endDate).startOf('day');
      return date.isBetween(start, end, 'day', '[]');
    });
  };

  const generateCycleInstances = () => {
    const cycles: Array<{
      Menstrual: [moment.Moment, moment.Moment];
      Follicular: [moment.Moment, moment.Moment];
      Ovulatory: [moment.Moment, moment.Moment];
      Luteal: [moment.Moment, moment.Moment];
    }> = [];

    if (!cycleData.periodStart) {
      return cycles;
    }

    // Only generate cycles for the current cycle and future cycles
    // Don't generate backward cycles - only show actual logged periods for past dates
    let cycleStart = cycleData.periodStart.clone();
    const endLimit = currentMonth.clone().add(6, 'months').endOf('month');

    // Generate the current cycle (from the most recent period)
    const currentPeriodStart = cycleStart.clone();
    const currentPeriodEnd = currentPeriodStart
      .clone()
      .add(cycleData.periodLength - 1, 'day');
    const currentOvulationDay = currentPeriodStart.clone().add(14, 'day');
    const currentFollicularStart = currentPeriodEnd.clone().add(1, 'day');
    const currentFollicularEnd = currentOvulationDay.clone().subtract(1, 'day');
    const currentLutealStart = currentOvulationDay.clone().add(1, 'day');
    const currentLutealEnd = currentPeriodStart
      .clone()
      .add(cycleData.cycleLength - 1, 'day');

    cycles.push({
      Menstrual: [currentPeriodStart, currentPeriodEnd],
      Follicular: [currentFollicularStart, currentFollicularEnd],
      Ovulatory: [currentOvulationDay, currentOvulationDay],
      Luteal: [currentLutealStart, currentLutealEnd],
    });

    // Generate forward cycles (future predictions only)
    let forwardStart = cycleStart.clone().add(cycleData.cycleLength, 'day');
    while (
      forwardStart.isBefore(endLimit) ||
      forwardStart.isSame(endLimit, 'month')
    ) {
      const periodStart = forwardStart.clone();
      const periodEnd = periodStart
        .clone()
        .add(cycleData.periodLength - 1, 'day');
      const ovulationDay = periodStart.clone().add(14, 'day');
      const follicularStart = periodEnd.clone().add(1, 'day');
      const follicularEnd = ovulationDay.clone().subtract(1, 'day');
      const lutealStart = ovulationDay.clone().add(1, 'day');
      const lutealEnd = periodStart
        .clone()
        .add(cycleData.cycleLength - 1, 'day');

      cycles.push({
        Menstrual: [periodStart, periodEnd],
        Follicular: [follicularStart, follicularEnd],
        Ovulatory: [ovulationDay, ovulationDay],
        Luteal: [lutealStart, lutealEnd],
      });

      forwardStart = forwardStart.clone().add(cycleData.cycleLength, 'day');
    }

    return cycles;
  };

  const allCycles = generateCycleInstances();

  const getPhaseForDate = (date: moment.Moment): PhaseType | null => {
    // If this date is within a logged period, it's menstrual phase
    if (isPeriodDate(date)) {
      return 'Menstrual';
    }

    // For past dates (before the most recent period start), only show if it's a logged period
    // Don't show predicted phases for past dates
    if (latestPeriodStart && date.isBefore(latestPeriodStart, 'day')) {
      return null; // No phase coloring for past dates without logged periods
    }

    // For current and future dates, calculate phase based on predicted cycles
    for (const cycle of allCycles) {
      for (const phase of Object.keys(cycle) as PhaseType[]) {
        const [start, end] = cycle[phase];
        if (date.isBetween(start, end, 'day', '[]')) return phase;
      }
    }
    return null;
  };

  // Calculate next phases based on current phase and cycle day
  const getNextPhases = (): Array<{ phase: PhaseType; days: number }> => {
    if (
      !currentPhase ||
      !cycleDay ||
      cycleDay <= 0 ||
      currentPhase === 'unknown'
    ) {
      return [];
    }

    const nextPhases: Array<{ phase: PhaseType; days: number }> = [];
    const currentDay = cycleDay;

    // Map lowercase phase names to PhaseType
    const phaseMap: Record<string, PhaseType> = {
      menstrual: 'Menstrual',
      follicular: 'Follicular',
      ovulatory: 'Ovulatory',
      luteal: 'Luteal',
    };

    const currentPhaseType = phaseMap[currentPhase] || null;

    if (currentPhaseType === 'Menstrual') {
      // Next: Follicular (after period ends)
      const daysToFollicular = periodLength - currentDay + 1;
      if (daysToFollicular > 0) {
        nextPhases.push({ phase: 'Follicular', days: daysToFollicular });
      }
      // Then: Ovulatory
      const daysToOvulatory =
        periodLength - currentDay + (14 - periodLength) + 1;
      if (daysToOvulatory > 0 && daysToOvulatory !== daysToFollicular) {
        nextPhases.push({ phase: 'Ovulatory', days: daysToOvulatory });
      }
    } else if (currentPhaseType === 'Follicular') {
      // Next: Ovulatory
      const daysToOvulatory = 14 - currentDay + 1;
      if (daysToOvulatory > 0) {
        nextPhases.push({ phase: 'Ovulatory', days: daysToOvulatory });
      }
      // Then: Luteal
      const daysToLuteal = 15 - currentDay + 1;
      if (daysToLuteal > 0 && daysToLuteal !== daysToOvulatory) {
        nextPhases.push({ phase: 'Luteal', days: daysToLuteal });
      }
    } else if (currentPhaseType === 'Ovulatory') {
      // Next: Luteal
      nextPhases.push({ phase: 'Luteal', days: 1 });
      // Then: Next Menstrual (next period)
      const daysToNextPeriod = cycleLength - currentDay + 1;
      if (daysToNextPeriod > 0) {
        nextPhases.push({ phase: 'Menstrual', days: daysToNextPeriod });
      }
    } else if (currentPhaseType === 'Luteal') {
      // Next: Menstrual (next period)
      const daysToNextPeriod = cycleLength - currentDay + 1;
      if (daysToNextPeriod > 0) {
        nextPhases.push({ phase: 'Menstrual', days: daysToNextPeriod });
      }
    }

    return nextPhases.slice(0, 2); // Return up to 2 next phases
  };

  const nextPhases = getNextPhases();

  // Calculate when the current cycle ends (next period start date)
  const getCurrentCycleEndDate = (): moment.Moment | null => {
    if (!latestPeriodStart) return null;

    // The current cycle ends when the next period starts
    // Next period = last period start + cycle length
    // Normalize to start of day to avoid timezone issues
    return latestPeriodStart.clone().add(cycleLength, 'day').startOf('day');
  };

  const currentCycleEndDate = getCurrentCycleEndDate();

  type CalendarCell =
    | { empty: true }
    | {
        empty?: false;
        day: number;
        phase: PhaseType | null;
        isFuture: boolean;
        isToday: boolean;
      };

  const generateCalendarGrid = () => {
    const grid: CalendarCell[] = [];
    const totalCells = 42;

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startDay + 1;

      if (dayNumber < 1 || dayNumber > daysInMonth) {
        grid.push({ empty: true });
      } else {
        const dateObj = currentMonth.clone().date(dayNumber);
        const phase = getPhaseForDate(dateObj);

        // Only apply future styling to dates ON OR AFTER the current cycle ends
        // (i.e., dates in future cycles, not dates in the current cycle)
        // Normalize both dates to start of day for accurate comparison
        const isFuture = currentCycleEndDate
          ? dateObj
              .startOf('day')
              .isSameOrAfter(currentCycleEndDate.startOf('day'), 'day')
          : dateObj.isAfter(today, 'day');

        // Check if this is today's date
        const isToday = dateObj.isSame(today, 'day');

        grid.push({
          day: dayNumber,
          phase,
          isFuture,
          isToday,
        });
      }
    }

    return grid;
  };

  const goPrevMonth = () =>
    setCurrentMonth(prev => prev.clone().subtract(1, 'month'));
  const goNextMonth = () =>
    setCurrentMonth(prev => prev.clone().add(1, 'month'));

  const handleLongPress = (date: moment.Moment) => {
    setSelectedDate(date);
    setActionMenuVisible(true);
  };

  const handleLogPeriodStart = () => {
    if (selectedDate && onLogPeriodStart) {
      onLogPeriodStart(selectedDate.toDate());
    }
    setActionMenuVisible(false);
    setSelectedDate(null);
  };

  const handleLogPeriodEnd = () => {
    if (selectedDate && onLogPeriodEnd) {
      onLogPeriodEnd(selectedDate.toDate());
    }
    setActionMenuVisible(false);
    setSelectedDate(null);
  };

  const handleViewPeriodDetails = () => {
    if (selectedDate && onViewPeriodDetails) {
      onViewPeriodDetails(selectedDate.toDate());
    }
    setActionMenuVisible(false);
    setSelectedDate(null);
  };

  const getPeriodForDate = (date: moment.Moment) => {
    return periods.find(period => {
      const start = moment(period.startDate).startOf('day');
      const end = period.endDate
        ? moment(period.endDate).startOf('day')
        : null;
      const dateStart = date.startOf('day');
      if (end) {
        return dateStart.isSameOrAfter(start) && dateStart.isSameOrBefore(end);
      }
      return dateStart.isSame(start);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.calenderMainView}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={images.periodCalender} style={styles.calenderImage} />
          <Text style={styles.cycleText}>Your Cycle Calendar</Text>
        </View>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={goPrevMonth}
            style={styles.arrowButtonView}
          >
            <Image source={images.leftArrow} style={styles.arrowStyle} />
          </TouchableOpacity>

          <Text style={styles.monthTitle}>
            {currentMonth.format('MMMM YYYY')}
          </Text>

          <TouchableOpacity
            onPress={goNextMonth}
            style={styles.arrowButtonView}
          >
            <Image source={images.rightArrow} style={styles.arrowStyle} />
          </TouchableOpacity>
        </View>
      </View>
      {nextPhases.length > 0 && (
        <View style={styles.phaseMainView}>
          {nextPhases.map((nextPhase, index) => (
            <View key={index} style={styles.phasesUpdateView}>
              <Text style={styles.nextText}>Next: {nextPhase.phase}</Text>
              <Text style={styles.daysText}>
                {nextPhase.days === 1 ? '1 day' : `${nextPhase.days} days`}
              </Text>
            </View>
          ))}
          {nextPhases.length === 1 && (
            <View style={[styles.phasesUpdateView, { opacity: 0.5 }]}>
              <Text style={styles.nextText}>—</Text>
              <Text style={styles.daysText}>—</Text>
            </View>
          )}
        </View>
      )}
      {nextPhases.length === 0 && (
        <View style={styles.phaseMainView}>
          <View style={styles.phasesUpdateView}>
            <Text style={styles.nextText}>No data available</Text>
            <Text style={styles.daysText}>—</Text>
          </View>
        </View>
      )}

      <View style={styles.weekRow}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <Text key={d} style={styles.weekDay}>
            {d}
          </Text>
        ))}
      </View>

      <FlatList
        data={generateCalendarGrid()}
        numColumns={7}
        scrollEnabled={false}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => {
          if (item.empty) return <View style={styles.emptyCell} />;
          const dateObj = currentMonth.clone().date(item.day);
          const periodForDate = getPeriodForDate(dateObj);
          return (
            <TouchableOpacity
              style={[
                styles.dayCell,
                item.phase ? { backgroundColor: PHASE_COLORS[item.phase] } : {},
                item.isFuture && styles.futureDayCell,
                item.isToday && styles.todayCell,
              ]}
              onLongPress={() => handleLongPress(dateObj)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dayText,
                  item.isFuture && styles.futureDayText,
                  item.isToday && styles.todayText,
                ]}
              >
                {item.day}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <View style={styles.horizontalLine} />

      <View style={styles.legendContainer}>
        {(Object.keys(PHASE_COLORS) as PhaseType[]).map(phase => (
          <View key={phase} style={styles.legendRow}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: PHASE_COLORS[phase] },
              ]}
            />
            <Text style={styles.legendText}>{phase}</Text>
          </View>
        ))}
      </View>
      <View style={styles.bottomTextView}>
        <Text style={styles.bottomText}>
          <Text style={{ color: colors.black, fontFamily: 'Inter-SemiBold' }}>
            Track your patterns:
          </Text>
           Your cycle is unique. This predictive calendar learns from your
          history to anticipate phase transitions.
        </Text>
      </View>

      {/* Action Menu Modal */}
      <Modal
        visible={actionMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setActionMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActionMenuVisible(false)}
        >
          <View style={styles.actionMenu}>
            <Text style={styles.actionMenuTitle}>
              {selectedDate?.format('MMMM D, YYYY')}
            </Text>
            {getPeriodForDate(selectedDate || moment()) ? (
              <TouchableOpacity
                style={styles.actionMenuItem}
                onPress={handleViewPeriodDetails}
              >
                <Text style={styles.actionMenuText}>View Period Details</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.actionMenuItem}
                  onPress={handleLogPeriodStart}
                >
                  <Text style={styles.actionMenuText}>Log Period Start</Text>
                </TouchableOpacity>
                {periods.some(p => p.startDate && !p.endDate) && (
                  <TouchableOpacity
                    style={styles.actionMenuItem}
                    onPress={handleLogPeriodEnd}
                  >
                    <Text style={styles.actionMenuText}>Log Period End</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
            <TouchableOpacity
              style={[styles.actionMenuItem, styles.actionMenuCancel]}
              onPress={() => setActionMenuVisible(false)}
            >
              <Text style={styles.actionMenuCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: sizes.screenWidth * 0.04,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: sizes.screenWidth * 0.03,
    marginVertical: 16,
  },

  calenderMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  phaseMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginVertical: 15,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  arrowStyle: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.025,
    height: sizes.screenWidth * 0.025,
  },

  monthTitle: {
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 12,
    color: colors.black,
    paddingHorizontal: 15,
  },

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  weekDay: {
    width: 40,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    color: colors.black,
    fontSize: 12,
  },

  emptyCell: {
    width: sizes.screenWidth * 0.11,
    height: sizes.screenWidth * 0.11,
    marginBottom: 8,
  },

  dayCell: {
    width: 40,
    height: 40,
    borderRadius: sizes.screenWidth * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    backgroundColor: '#F6F6F6',
  },

  dayText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.black,
  },

  futureDayCell: {
    opacity: 0.6,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderStyle: 'dashed',
  },

  futureDayText: {
    opacity: 0.8,
  },

  todayCell: {
    borderWidth: 2,
    borderColor: colors.heading || '#E4AF5D',
    borderStyle: 'solid',
  },

  todayText: {
    color: colors.heading || '#E4AF5D',
    fontWeight: 'bold',
  },

  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 5,
  },

  legendText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
  },

  cycleText: {
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 14,
    color: colors.black,
    marginLeft: 6,
  },

  calenderImage: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.035,
    height: sizes.screenWidth * 0.035,
  },

  nextText: {
    color: colors.green,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },

  daysText: {
    color: colors.heading,
    fontSize: 16,
    fontFamily: 'PlayfairDisplay-Regular',
  },

  phasesUpdateView: {
    backgroundColor: '#F6F6F6',
    padding: 15,
    width: sizes.screenWidth * 0.4,
    borderRadius: sizes.screenWidth * 0.03,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },

  horizontalLine: {
    width: sizes.screenWidth * 0.9,
    height: sizes.screenHeight * 0.0015,
    backgroundColor: colors.borderColorDark,
    marginVertical: 20,
  },

  bottomText: {
    color: colors.green,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },

  bottomTextView: {
    backgroundColor: '#F6F6F6',
    padding: 10,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: sizes.screenWidth * 0.02,
    marginTop: 20,
  },

  arrowButtonView: {
    // backgroundColor: 'red',
    height: 15,
    width: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionMenu: {
    backgroundColor: colors.white,
    borderRadius: sizes.screenWidth * 0.03,
    padding: 16,
    minWidth: 200,
    maxWidth: 300,
  },
  actionMenuTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
    marginBottom: 12,
    textAlign: 'center',
  },
  actionMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  actionMenuText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.black,
  },
  actionMenuCancel: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  actionMenuCancelText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.darkGrey,
    textAlign: 'center',
  },
});
