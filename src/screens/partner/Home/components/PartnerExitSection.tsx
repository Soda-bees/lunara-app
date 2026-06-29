import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../../../components/Button';
import { useOnboarding } from '../../../../context/OnboardingContext';
import { usePartnerMode } from '../../../../context/PartnerModeContext';
import { performExitPartnerView, type ExitPartnerViewOptions } from '../../../../utils/exitPartnerView';
import { colors } from '../../../../constants/colors';
import { partnerHomeStyles as styles } from '../style';
export default function PartnerExitSection() {
  const navigation = useNavigation();
  const { resetData } = useOnboarding();
  const { refreshSessionType } = usePartnerMode();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  const handleConfirmExit = async () => {
    setExiting(true);
    try {
      await performExitPartnerView({
        navigation: navigation as ExitPartnerViewOptions['navigation'],
        resetData,
        refreshSessionType,
      });
    } finally {
      setExiting(false);
      setVisible(false);
    }
  };

  return (
    <>
      <Button
        title="Exit partner view"
        onPress={() => setVisible(true)}
        disabled={exiting}
      />
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!exiting) setVisible(false);
        }}
      >
        <View style={styles.exitModalOverlay}>
          <View style={styles.exitModalCard}>
            <Text style={styles.exitModalTitle}>Exit partner view?</Text>
            <Text style={styles.exitModalMessage}>
              You will return to the welcome screen.
            </Text>
            <View style={styles.exitModalActions}>
              <TouchableOpacity
                style={[
                  styles.exitModalCancelButton,
                  exiting && styles.exitModalButtonDisabled,
                ]}
                onPress={() => setVisible(false)}
                disabled={exiting}
                activeOpacity={0.7}
              >
                <Text style={styles.exitModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.exitModalConfirmButton,
                  exiting && styles.exitModalButtonDisabled,
                ]}
                onPress={() => void handleConfirmExit()}
                disabled={exiting}
                activeOpacity={0.7}
              >
                {exiting ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.exitModalConfirmText}>Exit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
