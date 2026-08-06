import React from 'react';
import { Image, Text, View } from 'react-native';
import images from '../../../constants/images/cycle';
import { DidYouKnow } from '../../../services/api';
import { FALLBACK_DID_YOU_KNOW } from '../cycleInsightConstants';
import styles from '../style';

type Props = {
  personalizedInsight: string | null;
  didYouKnow: DidYouKnow | null;
  loadingDidYouKnow: boolean;
};

export default function CycleInsightDidYouKnow({
  personalizedInsight,
  didYouKnow,
  loadingDidYouKnow,
}: Props) {
  return (
    <View
      style={[
        styles.weeklyUpdateMaincontainer,
        { flexDirection: 'row', padding: 15, marginVertical: 15 },
      ]}
    >
      <Image source={images.ideaBulb} style={styles.ideaImage} />
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.infoText}>Did You Know?</Text>
        {loadingDidYouKnow && !personalizedInsight && !didYouKnow ? (
          <Text style={styles.infoSubText}>Loading...</Text>
        ) : (
          <>
            <Text style={styles.infoSubText}>
              {personalizedInsight ||
                didYouKnow?.fact ||
                FALLBACK_DID_YOU_KNOW.fact}
            </Text>
            {!personalizedInsight &&
              (didYouKnow?.author || FALLBACK_DID_YOU_KNOW.author) && (
                <Text style={styles.creditText}>
                  "Your cycle is your fifth vital sign."{'\n'} —{' '}
                  {didYouKnow?.author || FALLBACK_DID_YOU_KNOW.author}
                </Text>
              )}
          </>
        )}
      </View>
    </View>
  );
}
