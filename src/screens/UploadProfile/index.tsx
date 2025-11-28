import React, { useRef, useState } from 'react';
import {
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styles from './style';
import BackButton from '../../components/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import images from '../../constants/images';
import Button from '../../components/Button';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { colors } from '../../constants/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { sizes } from '../../constants/sizes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function UploadProfile() {
  const navigation = useNavigation<NavigationProp>();
  const [imageUri, setImageUri] = useState<string | undefined>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const [name, setName] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState<Date | null>(null);

  const onChange = (event: any, selectedDate: Date | undefined) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const openLibrary = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    launchImageLibrary({ mediaType: 'photo' }, response => {
      const asset = response?.assets?.[0];
      if (asset) setImageUri(asset.uri);
    });
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    launchCamera({ mediaType: 'photo' }, response => {
      const asset = response?.assets?.[0];
      if (asset) setImageUri(asset.uri);
    });
  };

  const handlePress = () => {
    navigation.navigate('AboutYouTransition', {
      profileImage: imageUri,
    });
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const startRotation = () => {
    rotateAnim.setValue(0);
    animationRef.current = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 7000,
        useNativeDriver: true,
      }),
    );
    animationRef.current.start();
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={Platform.OS == 'ios' ? ['top'] : ['top', 'bottom']}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <BackButton />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.mainContainer}>
          <KeyboardAvoidingView
            contentContainerStyle={{ flexGrow: 1 }}
            // style={{ flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 120}
          >
            <ScrollView>
              <View>
                <View
                  style={{
                    alignItems: 'center',
                  }}
                >
                  <View style={styles.outerContainer}>
                    <Animated.View
                      style={[
                        styles.rotatingBorder,
                        uploading && { transform: [{ rotate: spin }] },
                      ]}
                    />
                    <TouchableOpacity
                      style={styles.imageView}
                      onPress={openLibrary}
                    >
                      {imageUri ? (
                        <Image
                          source={{ uri: imageUri }}
                          style={styles.uploadedImage}
                        />
                      ) : (
                        <>
                          <Image
                            source={images.uploadImage}
                            style={styles.images}
                          />
                          <Text style={styles.imageText}>Upload Photo</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>

                  <View style={styles.dividerRow}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>or</Text>
                    <View style={styles.line} />
                  </View>

                  <TouchableOpacity
                    onPress={openCamera}
                    style={styles.openCameraRow}
                  >
                    <Image
                      source={images.cameraIconTwo}
                      style={styles.cameraIcon}
                    />
                    <Text style={styles.cameraText}>
                      Launch Camera for a New Photo
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.nameBirthdayView}>
                <Text style={styles.namePlaceholder}>Enter Your name</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                    placeholder="Your Name"
                    placeholderTextColor={colors.placeHolderGray}
                  />
                </View>
                <TouchableOpacity
                  style={styles.birthdayContainer}
                  onPress={() => setShowPicker(true)}
                >
                  <Text style={styles.dateText}>
                    {date
                      ? date.toLocaleDateString()
                      : 'Choose your date of birth'}
                  </Text>
                  <Image
                    source={images.periodCalender}
                    style={styles.profileproIconStyle}
                  />
                </TouchableOpacity>

                {showPicker && (
                  <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    display="default"
                    onChange={onChange}
                    maximumDate={new Date()}
                  />
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          <View style={styles.bottomButton}>
            <Button title="Continue" onPress={handlePress} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
