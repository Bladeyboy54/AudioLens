import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Text, Button, Image, Alert, TouchableOpacity } from "react-native";
import { RootStackParamList } from "../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import * as ImagePicker from 'expo-image-picker';
import recognizeText from "../services/OCR-Service";
// import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';


type HomeScreenProp = StackNavigationProp<RootStackParamList, 'Home'>;


const HomeScreen = () => {

    const navigation = useNavigation<HomeScreenProp>();

    const { hasPermission, requestPermission } = useCameraPermission();
    const cameraRef = useRef<Camera | null>(null);
    const [imageUri, setImageUri] = useState<string | null>(null);
    // const device = useCameraDevice('back');
    const [cameraActive, setCameraActive] = useState(true);
    

    //Request camera & gallery permissions
    
    // if (!hasPermission) {
    //     // Camera permissions are still loading.
    //     return <View />;
    //   }
    
    //   if (!hasPermission.granted) {
    //     // Camera permissions are not granted yet.
    //     return (
    //       <View style={styles.container}>
    //         <Text style={styles.message}>We need your permission to show the camera</Text>
    //         <Button title="Grant Permission" onPress={requestPermission} />
    //       </View>
    //     );
    //   }
    //   const toggleCameraFacing = () => {
    //     setFacing((current) => (current === 'back' ? 'front' : 'back'));
    //   };
    
    //Handle taking a picture 
    const device = useCameraDevice('back');
    

    if (device == null) return <Text>Loading Camera...</Text>;

    const takePicture = async () => {
        if (cameraRef.current) {
          const photo = await cameraRef.current.takePhoto({
            flash: 'off',
          });
          setImageUri(photo.path);
          setCameraActive(false);
        }
      };
    // const takePicture = async () => {
    //     if (cameraRef.current) {
    //       const options = { quality: 1, base64: true, exif: false };
    //       const photo = await cameraRef.current.takePictureAsync(options);
    //       setImageUri(photo.uri);
    //     }
    //   };
    

    //Pick an image from the gallery
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          setImageUri(result.assets[0].uri);
          setCameraActive(false);
        }
      };
      if (!hasPermission) {
        return (
          <View style={styles.container}>
            <Text>We need your permission to access the camera</Text>
          </View>
        );
      }

      return (
        <View style={styles.container}>
          {imageUri ? (
            <>
              {/* If an image is captured or selected, show the image and options */}
              <Image source={{ uri: imageUri }} style={styles.preview} />
              <Button title="Recognize Text" onPress={() => recognizeText(imageUri)} />
              <Button title="Pick Another Image" onPress={pickImage} />
            </>
          ) : (
            cameraActive && (
          <Camera
            style={styles.camera}
            device={device}
            isActive={cameraActive}
            ref={cameraRef}
            photo={true}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={takePicture}>
                <Text style={styles.text}>Take Picture</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.text}>Pick from Gallery</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        )
          )}
        </View>
      );
    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    message: {
      textAlign: 'center',
      paddingBottom: 10,
    },
    camera: {
      flex: 1,
    },
    preview: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    button: {
      margin: 20,
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 10,
    },
    text: {
      fontSize: 18,
      color: 'black',
    },
  });

export default HomeScreen;