import {
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useState } from 'react';
import styles from './style';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stackNavigation';
import Button from '../../components/Button';
import SoftGradientBackground from '../../components/SoftGradientBackground';
import BackButton from '../../components/BackButton';
import { colors } from '../../constants/colors';
import { ErrorShow } from '../../components/Toast';
import { useJournal } from '../../context/JournalContext';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'WriteJournal'
>;
type WriteJournalRouteProp = RouteProp<RootStackParamList, 'WriteJournal'>;

const WriteJournal = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<WriteJournalRouteProp>();
  const { addJournal, updateJournal } = useJournal();
  const journal = route.params?.journal;

  const [title, setTitle] = useState(journal?.title || '');
  const [notes, setNotes] = useState(journal?.description || '');
  const [loader, setLoader] = useState(false);

  const isEdit = !!journal;

  const handleSaveJournal = async () => {
    try {
      setLoader(true);

      const body = { title, description: notes };

      if (isEdit && journal?._id) {
        await updateJournal(journal._id, body);
        ErrorShow({
          type: 'success',
          title: 'Updated!',
          message: 'Journal updated successfully.',
          onHide,
        });
      } else {
        await addJournal(body);
        ErrorShow({
          type: 'success',
          title: 'Added!',
          message: 'Journal added successfully.',
          onHide,
        });
      }
    } catch (error: any) {
      ErrorShow({
        type: 'error',
        title: 'Oops!',
        message: error?.message || 'Something went wrong.',
      });
    } finally {
      setLoader(false);
    }
  };

  const onHide = () => {
    navigation.goBack();
  };

  return (
    <SoftGradientBackground>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <BackButton />
          <View style={styles.mainContainer}>
            <TextInput
              style={styles.titleInput}
              placeholder="Add Title...."
              placeholderTextColor="#7D7D7D"
              value={title}
              onChangeText={setTitle}
              autoCapitalize="words"
            />

            <TextInput
              style={styles.notesInput}
              placeholder="Add Notes...."
              placeholderTextColor={colors.disabledText}
              value={notes}
              onChangeText={setNotes}
              multiline
              textAlignVertical="top"
              autoCapitalize="sentences"
            />

            <View style={styles.btnContainer}>
              <Button
                title={isEdit ? 'Update Journal' : '+ Add Journal'}
                disabled={!title || !notes}
                onPress={handleSaveJournal}
                loader={loader}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SoftGradientBackground>
  );
};

export default WriteJournal;
