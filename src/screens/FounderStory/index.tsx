import {
  View,
  Text,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './style';
import BackButton from '../../components/BackButton';
import GradientWrapper from '../../components/GradientWrapper';
import images from '../../constants/images/common';
import { colors } from '../../constants/colors';

export default function FounderStory() {
  const timelineData = [
    {
      time: '6:30 AM',
      title: 'Morning Check-in',
      icon: images.morningIcon,
      desc: "I open Lunara before I even get out of bed. It tells me I'm in my follicular phase—rising energy. Today's a good day to tackle that big project I've been planning.",
    },
    {
      time: '7:00 AM',
      title: 'Nutrition',
      icon: images.bookIcon,
      desc: 'The app suggests a light, protein-rich breakfast. No more guessing—I know exactly what will fuel my body today. Green smoothie with hemp seeds and berries it is.',
    },
    {
      time: '9:00 AM',
      title: 'Work Sessions',
      icon: images.sparkle,
      desc: "I schedule my most creative work during follicular and ovulatory phases. Today I'm in flow—ideas are coming easily, my mind is sharp. Ten years ago, I would've forced this on a low-energy day and gotten nowhere.",
    },
    {
      time: '5:30 PM',
      title: 'Movement',
      icon: images.feelingsIcon,
      desc: 'HIIT workout today—my body loves intensity in this phase. During my luteal phase next week, I’ll switch to yoga. No guilt, no forcing—just listening.',
    },
    {
      time: '9:00 PM',
      title: 'Evening Reflection',
      icon: images.currentPhaseIconMain,
      desc: 'I log how I felt today. Lunara shows me patterns I never would’ve noticed—like how my sleep quality affects my next-day energy by phase. Knowledge is power.',
    },
  ];
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <BackButton />
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
        <Text style={styles.ourStoryTopView}>Our Story</Text>
        <Text style={styles.forgotText}>Why I Built Lunara</Text>
        <Text style={styles.paraText}>
          From struggling with my own cycle to creating a{'\n'}movement of women
          who understand their bodies
        </Text>
          <GradientWrapper variant="basic">
            <View style={styles.gradientMainView}>
              <View style={styles.movementMainView}>
                <Image
                  source={images.feelingsIcon}
                  style={styles.feelingsIconStyle}
                />
                <Text style={styles.mainHeading}>My Journey</Text>
              </View>
              <Text style={styles.myStory}>
                Ten years ago, I was exhausted, bloated, and frustrated with my
                body. Every month felt like a battle— unpredictable periods,
                crushing PMS, energy that would crash without warning. I visited
                doctors who told me it was "normal" and handed me prescriptions
                that made me feel even worse.{'\n'}
                {'\n'}I was a successful professional, but I was planning my
                life around avoiding my period. Turning down opportunities
                because I didn't know if I'd be functional that week. Forcing
                myself through intense workouts when my body was screaming for
                rest. Feeling guilty for being "emotional" when it was just my
                hormones doing what they're designed to do.{'\n'}
                {'\n'}
                <Text style={{ color: colors.heading }}>
                  Then I discovered cycle syncing, and everything changed.
                </Text>
                {'\n'}
                {'\n'}
                Within three months of aligning my nutrition, movement, and work
                schedule with my cycle phases, I felt like a different person.
                The brain fog lifted. The PMS symptoms nearly disappeared. I had
                consistent energy throughout the month—not the same energy, but
                predictable, powerful rhythms I could work WITH instead of
                against.{'\n'}But here's what made me angry:
                <Text
                  style={{ color: colors.black, fontFamily: 'Inter-Medium' }}
                >
                  Why wasn't this taught in school? Why did it take me 15 years
                  of menstruating to learn this?
                </Text>
              </Text>
            </View>
          </GradientWrapper>
          <View style={styles.visionBehindView}>
            <View style={styles.movementMainView}>
              <Image source={images.sparkle} style={styles.feelingsIconStyle} />
              <Text style={styles.mainHeading}>The Vision Behind Lunara</Text>
            </View>
            <Text style={styles.myStory}>
              I built Lunara because women's health deserves better than period
              trackers that just predict your next bleed. We deserve tools that
              teach us, empower us, and work with the sophisticated biological
              systems we have.{'\n'}
              {'\n'}Lunara isn't just an app—it's a complete reframe of how we
              relate to our bodies. Instead of seeing your cycle as an
              inconvenience, you see it as your personal operating system. Each
              phase becomes a superpower when you know how to use it.
            </Text>
            <View style={styles.visionBehindBottomView}>
              <Text style={styles.visionBehindBottomText}>❌ Old Way</Text>
              <Text style={[styles.myStory, { color: colors.green }]}>
                Fight your body. Force the same routine every day. Feel broken
                when you can't keep up.
              </Text>
            </View>
            <View style={styles.visionBehindBottomView}>
              <Text style={styles.visionBehindBottomText}>✅ Lunara Way</Text>
              <Text style={[styles.myStory, { color: colors.green }]}>
                Sync with your body. Personalize your routine. Unlock your full
                potential by working with your natural rhythms.
              </Text>
            </View>
          </View>
          <View style={styles.visionBehindView}>
            <View style={styles.movementMainView}>
              <Image
                source={images.feelingsIcon}
                style={styles.feelingsIconStyle}
              />
              <Text style={styles.mainHeading}>A Day in My Life Now</Text>
            </View>
            <View style={styles.timelineContainer}>
              {timelineData.map((item, index) => (
                <View key={index} style={styles.timelineRow}>
                  <View style={styles.iconColumn}>
                    <View style={styles.imageMainView}>
                      <Image source={item.icon} style={styles.imageView} />
                    </View>

                    {index !== timelineData.length - 1 && (
                      <View style={styles.verticalLine} />
                    )}
                  </View>

                  <View style={styles.textColumn}>
                    <Text style={styles.timeText}>
                      {item.time} - {item.title}
                    </Text>
                    <Text style={styles.descText}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View style={[styles.visionBehindView, { marginBottom: 16 }]}>
            <Text style={[styles.mainHeading, { textAlign: 'center' }]}>
              My Life: Then vs. Now
            </Text>
            <Text style={styles.yearText}>10 Years Ago</Text>
            <Text style={styles.yearsAgoText}>
              ❌ Debilitating cramps every month{'\n'}❌ PMS that lasted 2 weeks
              {'\n'}❌ Brain fog I couldn't explain{'\n'}❌ Avoiding social
              events{'\n'}❌ Frustrated with my body{'\n'}❌ Thought I was "just
              hormonal"{'\n'}❌ Forcing the same routine daily
            </Text>
            <Text style={[styles.yearText, { color: colors.heading }]}>
              Today
            </Text>
            <Text style={styles.yearsAgoText}>
              ✅ Minimal period symptoms{'\n'}✅ Stable, predictable moods{'\n'}
              ✅ Clear mind and focus{'\n'}✅ Planning life WITH my cycle{'\n'}
              ✅ In awe of my body{'\n'}✅ Understanding my patterns{'\n'}✅
              Syncing my life to my biology
            </Text>
          </View>
          <GradientWrapper variant="basic">
            <View style={{paddingHorizontal: 16}}>

            <Text style={styles.mainHeading}>Join the Movement</Text>
            <Text style={[styles.myStory]}>
              Lunara is more than an app—it's a revolution in women's health. A
              community of women who refuse to fight their bodies anymore. Who
              understand that our cycles aren't curses—they're superpowers.
              {'\n'}
              {'\n'}If my story resonates with you, if you're tired of feeling
              like your body is working against you, if you want to finally
              understand what's happening inside you—Lunara is for you.
            </Text>
            {/* <TouchableOpacity style={styles.logButton} activeOpacity={0.8}>
              <Text style={styles.text}>Start Your Journey</Text>
            </TouchableOpacity> */}
            <Text style={styles.bottomText}>With love and lunar cycles,{'\n'}The Lunara Founder</Text>
            </View>
          </GradientWrapper>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
