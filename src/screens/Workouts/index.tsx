import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './style';
import GradientWrapper from '../../components/GradientWrapper';
import images from '../../constants/images';
import { colors } from '../../constants/colors';
import Header from '../../components/Header';
import MovementLogged from '../../components/MovementLogged';
import MovementMap from '../../components/MovementMap';
import { sizes } from '../../constants/sizes';

export default function Workouts() {
  const movementScienceData = [
    {
      title: 'Muscle & Insulin',
      description:
        'Muscle contraction increases insulin sensitivity—helping regulate blood sugar and hormone balance.',
      image: '💪',
    },
    {
      title: 'Walking After Meals',
      description:
        'A 10-minute walk after eating can reduce estrogen dominance and improve digestion.',
      image: '🚶‍♀️',
    },
    {
      title: 'Follicular Strength',
      description:
        'Strength training during the follicular phase amplifies muscle growth and metabolic results.',
      image: '🏋️‍♀️',
    },
    {
      title: 'Cortisol Balance',
      description:
        'Gentle movement during menstruation helps lower cortisol while supporting lymphatic flow.',
      image: '🧘‍♀️',
    },
    {
      title: 'Dopamine Boost',
      description:
        'High-energy workouts during ovulation maximize dopamine production and mood elevation.',
      image: '⚡',
    },
    {
      title: 'Recovery Matters',
      description:
        'Progesterone naturally slows you down—honor this by choosing lower-impact movement in your luteal phase.',
      image: '🌙',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header />
      <ScrollView>
        <View style={{ marginVertical: 16 }}>
          <Text style={styles.forgotText}>Hormone-Intelligent Movement</Text>
          <Text style={styles.paraText}>
            Align your workouts with your cycle for optimal results
          </Text>
          <GradientWrapper variant="basic">
            <View style={styles.phaseBody}>
              <View style={styles.rowFull}>
                <View style={styles.rowBottom}>
                  <View>
                    <Text style={styles.numberTextMedium}>
                      Your Current Phase
                    </Text>
                    <Text style={[styles.forgotText, { fontSize: 24 }]}>
                      Follicular Phase
                    </Text>
                    <View style={styles.risingMainView}>
                      <Text
                        style={[
                          styles.numberTextMedium,
                          { color: colors.heading },
                        ]}
                      >
                        Rising - Power Building
                      </Text>
                    </View>
                  </View>
                </View>
                <Image
                  source={images.dumbellIcon}
                  style={styles.dumbellsIcon}
                />
              </View>
              <Text style={styles.textDarkGrey}>
                Estrogen is rising, metabolism is increasing. Your body is
                primed to build strength and endurance.
              </Text>
              <View style={styles.cautionView}>
                <Image source={images.energyHigh} style={styles.icon} />
                <View>
                  <Text style={styles.heading}>Hormone Benefit</Text>
                  <Text style={styles.durationText}>
                    Supports estrogen metabolism, builds lean muscle, enhances
                    insulin sensitivity
                  </Text>
                </View>
              </View>
              <View style={styles.cautionView}>
                <Image
                  source={images.informationIcon}
                  style={[styles.icon, { tintColor: 'red' }]}
                />
                <View>
                  <Text style={styles.heading}>What to Avoid</Text>
                  <Text style={styles.durationText}>
                    Over-restriction or under-eating
                  </Text>
                </View>
              </View>
            </View>
          </GradientWrapper>
          <MovementLogged />
          <MovementMap />
          <View style={styles.movementScienceView}>
            <Text style={styles.mainHeading}>Movement Science</Text>
            {movementScienceData.map((item, index) => {
              return (
                <View style={styles.cautionView} key={index}>
                  {/* <Image source={item.image} style={styles.movementIcon} /> */}
                  <Text style={styles.movementIcon}>{item.image}</Text>
                  <View>
                    <Text
                      style={[
                        styles.heading,
                        {
                          fontFamily: 'PlayfairDisplay-Medium',
                          width: sizes.screenWidth * 0.45,
                        },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text style={styles.durationText}>{item.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
