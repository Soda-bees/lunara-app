import React, { useState } from 'react';
import {
  Image,
  Keyboard,
  PermissionsAndroid,
  Platform,
  StatusBar,
  Text,
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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function UploadProfile() {
  const navigation = useNavigation<NavigationProp>();
  const [imageUri, setImageUri] = useState<string | undefined>('');

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
      const uri = response?.assets?.[0]?.uri;
      const asset = response?.assets?.[0];
      if (asset) {
        setImageUri(asset.uri);
      }
    });
  };

  const handlePress = () => {
    navigation.navigate('GetToKnow', {
      profileImage: imageUri, // pass forward
    });
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
          <View>
            <View style={styles.textContainer}>
              <Text style={styles.forgotText}>Upload Your Profile</Text>
              <Text style={styles.paraText}>
                Add a profile picture to make your{'\n'}Lunara experience more
                personal. Don’t{'\n'}worry — it’s just for you.
              </Text>
            </View>

            <View style={{ alignItems: 'center', marginTop: 30 }}>
              <TouchableOpacity
                onPress={openLibrary}
                style={styles.imageWrapper}
              >
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.profileImg} />
                ) : (
                  <>
                    <Image source={images.uploadImage} style={styles.images} />
                    <Text style={{ color: colors.black, marginTop: 6 }}>
                      Upload Photo
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <Text style={{ color: colors.gray, marginVertical: 12 }}>or</Text>

              <TouchableOpacity
                onPress={openCamera}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Image
                  source={images.cameraIcon}
                  style={{
                    width: 22,
                    height: 22,
                    marginRight: 4,
                    resizeMode: 'contain',
                  }}
                />
                <Text style={{ color: colors.primary }}>
                  Launch Camera for a New Photo
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomButton}>
            <Button
              title="Continue"
              onPress={handlePress}
              disabled={!imageUri}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
