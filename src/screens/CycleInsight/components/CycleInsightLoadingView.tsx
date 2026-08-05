import React from 'react';
import { ActivityIndicator, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { colors } from '../../../constants/colors';
import styles from '../style';

export default function CycleInsightLoadingView() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header />
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.darkGrey }}>
          Loading cycle data...
        </Text>
      </View>
    </SafeAreaView>
  );
}
