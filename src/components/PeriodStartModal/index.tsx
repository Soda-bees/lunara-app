import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
} from 'react-native';
import images from '../../constants/images';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

interface PeriodStartModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
}

const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const PeriodStartModal: React.FC<PeriodStartModalProps> = ({
  visible,
  onClose,
  onSelectDate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selected, setSelected] = useState<number | null>(null);
  console.log('selectedData', selected);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const goPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getMonthGrid = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    let grid: { empty?: boolean; day?: number }[] = [];

    for (let i = 0; i < firstDay; i++) grid.push({ empty: true });
    for (let i = 1; i <= totalDays; i++) grid.push({ day: i });

    return grid;
  };

  const grid = getMonthGrid();

  const handleConfirm = () => {
    if (selected === null) return;

    const finalDate = new Date(Date.UTC(year, month, selected));

    console.log('Modal finalDate:', finalDate.toISOString());

    onSelectDate(finalDate);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={styles.title}>Log Period Start</Text>
            <TouchableOpacity
              onPress={() => onClose()}
              style={styles.crossButtonStyle}
              activeOpacity={0.8}
            >
              <Image source={images.crossButton} style={styles.crossStyle} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subText}>
            Select the date your period started
          </Text>

          <View style={styles.monthHeader}>
            <TouchableOpacity onPress={goPrevMonth}>
              <Image
                source={images.rightArrow}
                style={[styles.arrow, { transform: [{ rotate: '180deg' }] }]}
              />
            </TouchableOpacity>

            <Text style={styles.monthText}>
              {currentDate.toLocaleString('default', { month: 'long' })} {year}
            </Text>

            <TouchableOpacity onPress={goNextMonth}>
              <Image source={images.rightArrow} style={styles.arrow} />
            </TouchableOpacity>
          </View>

          <View style={styles.weekRow}>
            {days.map(d => (
              <Text key={d} style={styles.weekText}>
                {d}
              </Text>
            ))}
          </View>

          <View style={styles.grid}>
            {grid.map((item, index) =>
              item.empty ? (
                <View key={index} style={styles.emptyCell} />
              ) : (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    selected === item.day && styles.selectedCell,
                  ]}
                  onPress={() => setSelected(item.day!)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selected === item.day && styles.selectedText,
                    ]}
                  >
                    {item.day}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>

          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
  },

  title: {
    fontSize: 20,
    marginBottom: 6,
    fontFamily: 'PlayfairDisplay-SemiBold',
  },

  subText: {
    color: colors.green,
    marginBottom: 18,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  monthText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  weekText: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    color: colors.green,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: 25,
  },

  dayCell: {
    width: `${100 / 7}%`,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },

  selectedCell: {
    backgroundColor: '#f5c875',
    borderRadius: sizes.screenWidth * 0.02,
  },

  dayText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },

  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },

  emptyCell: {
    width: `${100 / 7}%`,
    height: 40,
  },

  confirmBtn: {
    backgroundColor: '#E9C46A',
    paddingVertical: 10,
    borderRadius: 12,
  },

  confirmText: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },

  arrow: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },

  crossStyle: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.03,
    height: sizes.screenWidth * 0.03,
  },

  crossButtonStyle: {
    width: sizes.screenWidth * 0.05,
    height: sizes.screenWidth * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default PeriodStartModal;
