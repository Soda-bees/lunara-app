import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './style';
import images from '../../constants/images/journal';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stackNavigation';
import SoftGradientBackground from '../../components/SoftGradientBackground';
import { JournalType } from '../../types';
import TouchAnimation from '../../components/TouchAnimation';
import Modal from 'react-native-modal';
import { ErrorShow } from '../../components/Toast';
import { useJournal } from '../../context/JournalContext';
import { getJournal } from '../../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Journal'>;
type RouteProps = RouteProp<RootStackParamList, 'Journal'>;

const Journal = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { id } = route.params;
  const { journals, loading, deleteJournal, togglePin } = useJournal();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [journal, setJournal] = useState<JournalType | undefined>(undefined);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const found = journals.find(j => j._id === id);
    setJournal(found);
  }, [id, journals]);

  useEffect(() => {
    if (loading) return;
    if (journals.some(j => j._id === id)) return;

    let cancelled = false;
    setDetailLoading(true);
    getJournal(id)
      .then(res => {
        if (!cancelled) {
          setJournal({
            _id: res.data._id,
            title: res.data.title,
            description: res.data.description ?? '',
            createdAt: res.data.createdAt,
            updatedAt: res.data.updatedAt,
            pin: res.data.pin ?? false,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setJournal(undefined);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setDetailLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, loading, journals]);

  const [dropDown, setDropDown] = useState<boolean>(false);

  const handleToggelJournalPin = async () => {
    if (!journal?._id) return;
    try {
      await togglePin(journal._id);
    } catch (error: any) {
      ErrorShow({
        type: 'error',
        title: 'Oops!',
        message: error?.message || 'Could not update pin.',
      });
    }
  };

  const handleDeleteJournal = async () => {
    if (!journal?._id) return;
    try {
      setDeleteLoader(true);
      await deleteJournal(journal._id);
      setDeleteModalVisible(false);
      ErrorShow({
        type: 'success',
        title: 'Deleted!',
        message: 'Journal deleted successfully.',
        onHide,
      });
    } catch (error: any) {
      ErrorShow({
        type: 'error',
        title: 'Oops!',
        message: error?.message || 'Something went wrong.',
      });
    } finally {
      setDeleteLoader(false);
    }
  };

  const onHide = async () => {
    navigation.goBack();
  };

  function formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const weekday = date.toLocaleString('default', { weekday: 'long' });

    return `${day} ${month} ${year} ${weekday}`;
  }

  const handleEditJournal = () => {
    if (!journal) return;
    navigation.navigate('WriteJournal', { journal });
  };

  const showDetailLoader = !journal && (loading || detailLoading);
  const showNotFound = !journal && !loading && !detailLoading;

  return (
    <SoftGradientBackground>
      <TouchableWithoutFeedback
        onPress={() => {
          if (dropDown) setDropDown(false);
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ zIndex: 1 }}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Image source={images.backIcon} style={styles.backIcon} />
              </TouchableOpacity>
              <TouchAnimation
                // slow
                onPress={() => {
                  setDropDown(!dropDown);
                }}
              >
                <Image source={images.editDots} style={styles.dots} />
              </TouchAnimation>
            </View>
            {dropDown && (
              <View style={styles.dropDownContainer}>
                <View style={styles.dropDown}>
                  <TouchableOpacity
                    style={styles.dropDownBtn}
                    onPress={() => {
                      setDropDown(false);
                      handleEditJournal();
                    }}
                  >
                    <Image source={images.edit} style={styles.icon} />
                    <Text style={styles.textBlack}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dropDownBtn}
                    onPress={() => {
                      setDropDown(false);
                      setDeleteModalVisible(true);
                    }}
                  >
                    <Image source={images.deleteIcon} style={styles.icon} />
                    <Text style={styles.textBlack}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dropDownBtn}
                    onPress={handleToggelJournalPin}
                  >
                    <Image source={images.pin} style={styles.icon} />
                    <Text style={styles.textBlack}>
                      {journal?.pin ? 'Unpin' : 'Pin'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
          <View style={styles.body}>
            {showDetailLoader ? (
              <ActivityIndicator size="large" />
            ) : showNotFound ? (
              <Text style={styles.note}>
                Journal not found or you no longer have access.
              </Text>
            ) : (
              <>
                <View>
                  <Text style={styles.heading}>{journal?.title}</Text>
                  <Text style={styles.note}>{journal?.description}</Text>
                </View>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateText}>
                    {formatDate(journal?.createdAt ?? '')}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
      <Modal
        isVisible={deleteModalVisible}
        style={{ justifyContent: 'center', margin: 10 }}
      >
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#333',
              marginBottom: 15,
              textAlign: 'center',
            }}
          >
            Are you sure you want to delete this journal?
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
              width: '100%',
            }}
          >
            <TouchAnimation
              onPress={() => !deleteLoader && setDeleteModalVisible(false)}
              slow
              containerStyle={{
                flex: 1,
                marginRight: 5,
                paddingVertical: 12,
                backgroundColor: '#E0E0E0',
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 16, color: '#333', fontWeight: '500' }}>
                Cancel
              </Text>
            </TouchAnimation>

            <TouchAnimation
              onPress={() => !deleteLoader && handleDeleteJournal()}
              slow
              containerStyle={{
                flex: 1,
                marginLeft: 5,
                paddingVertical: 12,
                backgroundColor: '#FF4C4C',
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              {deleteLoader ? (
                <ActivityIndicator size={23} />
              ) : (
                <Text
                  style={{ fontSize: 16, color: '#fff', fontWeight: '600' }}
                >
                  Delete
                </Text>
              )}
            </TouchAnimation>
          </View>
        </View>
      </Modal>
    </SoftGradientBackground>
  );
};

export default Journal;
