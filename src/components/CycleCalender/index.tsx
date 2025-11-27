import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import moment from 'moment';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import images from '../../constants/images';

type PhaseType = 'Menstrual' | 'Follicular' | 'Ovulatory' | 'Luteal';

type CycleCalendarProps = {
  periodStart: Date | null;
};

const PHASE_COLORS: Record<PhaseType, string> = {
  Menstrual: '#FFF0F3',
  Follicular: '#FFF2DD',
  Ovulatory: '#E4AF5D',
  Luteal: '#F6F6F6',
};

export default function CycleCalendar({ periodStart }: CycleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(moment());

  const startOfMonth = currentMonth.clone().startOf('month');
  const daysInMonth = currentMonth.daysInMonth();
  const startDay = startOfMonth.day();

  const cycleLength = 28;
  const periodLength = 6;

  const cycleData = {
    periodStart: periodStart ? moment(periodStart) : moment(),
    // periodStart: moment(periodStart),
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

  const generateCycleInstances = () => {
    const cycles = [];
    let cycleStart = cycleData.periodStart.clone();

    const endLimit = currentMonth.clone().add(6, 'months').endOf('month');

    while (cycleStart.isBefore(endLimit)) {
      const periodStart = cycleStart.clone();
      const periodEnd = cycleStart
        .clone()
        .add(cycleData.periodLength - 1, 'day');

      const ovulationDay = cycleStart.clone().add(14, 'day');

      const follicularStart = periodEnd.clone().add(1, 'day');
      const follicularEnd = ovulationDay.clone().subtract(1, 'day');

      const lutealStart = ovulationDay.clone().add(1, 'day');
      const lutealEnd = cycleStart
        .clone()
        .add(cycleData.cycleLength - 1, 'day');

      cycles.push({
        Menstrual: [periodStart, periodEnd],
        Follicular: [follicularStart, follicularEnd],
        Ovulatory: [ovulationDay, ovulationDay],
        Luteal: [lutealStart, lutealEnd],
      });

      cycleStart = cycleStart.clone().add(cycleData.cycleLength, 'day');
    }

    return cycles;
  };

  const allCycles = generateCycleInstances();

  const getPhaseForDate = (date: moment.Moment): PhaseType | null => {
    for (const cycle of allCycles) {
      for (const phase of Object.keys(cycle) as PhaseType[]) {
        const [start, end] = cycle[phase];
        if (date.isBetween(start, end, 'day', '[]')) return phase;
      }
    }
    return null;
  };

  type CalendarCell =
    | { empty: true }
    | { empty?: false; day: number; phase: PhaseType | null };

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

        grid.push({
          day: dayNumber,
          phase,
        });
      }
    }

    return grid;
  };

  const goPrevMonth = () =>
    setCurrentMonth(prev => prev.clone().subtract(1, 'month'));
  const goNextMonth = () =>
    setCurrentMonth(prev => prev.clone().add(1, 'month'));

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
      <View style={styles.phaseMainView}>
        <View style={styles.phasesUpdateView}>
          <Text style={styles.nextText}>Next: Ovulatory</Text>
          <Text style={styles.daysText}>6 days</Text>
        </View>
        <View style={styles.phasesUpdateView}>
          <Text style={styles.nextText}>Next: Luteal</Text>
          <Text style={styles.daysText}>10 days</Text>
        </View>
      </View>

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
          return (
            <View
              style={[
                styles.dayCell,
                item.phase ? { backgroundColor: PHASE_COLORS[item.phase] } : {},
              ]}
            >
              <Text style={styles.dayText}>{item.day}</Text>
            </View>
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
});
