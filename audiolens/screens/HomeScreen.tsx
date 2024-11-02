import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Text, Button, Image, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { RootStackParamList } from "../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import * as ImagePicker from 'expo-image-picker';
import recognizeText from "../services/OCR-Service";
import { CameraProps, CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons, AntDesign, Entypo } from '@expo/vector-icons';
// import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';


type HomeScreenProp = StackNavigationProp<RootStackParamList, 'Home'>;


const HomeScreen = () => {

    const navigation = useNavigation<HomeScreenProp>();

    const cameraRef = useRef<CameraView>(null);
    const [facing, setFacing] = useState<CameraProps["facing"]>("back");
    const [permission, requestPermission] = useCameraPermissions();
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    
    //Handle camera permission /////////////////////////////////////////////////////////////////////////
    
  
    if (!permission) {
      // Camera permissions are still loading.
      return <View />;
    }
  
    if (!permission.granted) {
      // Camera permissions are not granted yet.
      return (
        <View style={styles.container}>
          <Text style={{ textAlign: "center" }}>
            We need your permission to show the camera
          </Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
      );
    }
  
    function toggleCameraFacing() {
      setFacing((current) => (current === "back" ? "front" : "back"));
    }
    
    //Handle Text Recognition //////////////////////////////////////////////////////////////////////

    const handleRecognizeText = async (imageUri: string) => {
      try {
        setLoading(true);
        const detectedText = await recognizeText(imageUri)
        setLoading(false);
        if (detectedText) {
          navigation.navigate('TextRecognition', {ocrText: detectedText})
        }
      } catch (e) {
        setLoading(false); // Stop loading when there is an error
        console.error("recognize text error ==>" + e)
        Alert.alert("Error", "Failed to recognize text")
      }
    }

    //Pick an image from the gallery ///////////////////////////////////////////////////////////////
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          setImageUri(result.assets[0].uri);
          
        }
      };
      if (!permission) {
        return (
          <View style={styles.container}>
            <Text>We need your permission to access the camera</Text>
          </View>
        );
      }
// Main Return /////////////////////////////////////////////////////////////////////////////////
      return (
        <View style={styles.container}>
          {imageUri ? (
            <>
              {/* Preview section with back button */}
              <View style={styles.previewContainer}>
                  <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => setImageUri(null)} // Go back to camera
                  >
                      <Ionicons name="arrow-back" size={30} color="white" />
                  </TouchableOpacity>
                  <Image source={{ uri: imageUri }} style={styles.preview} />
                  <View style={styles.buttonContainer}>
                    {loading ? (
                      <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                      <Button title="Recognize Text" onPress={() => handleRecognizeText(imageUri)} />
                    )}
                  </View>
                  
              </View>
            </>
          ) : (
            
            <View style={styles.cameraContainer}>
              <CameraView
                style={styles.camera}
                facing={facing}
                ref={cameraRef}
              >

              {/* Camera control buttons */}
              <View style={styles.buttonRow}>
                {/* Flip Camera Button */}
                <TouchableOpacity onPress={toggleCameraFacing} style={styles.iconButton}>
                  <AntDesign name="swap" size={40} color="white" />
                </TouchableOpacity>

                {/* Capture Image Button */}
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={async () => {
                    const photo = await cameraRef.current?.takePictureAsync();
                    setImageUri(photo!.uri);
                    console.log(JSON.stringify(photo));
                  }}
                >
                  <Ionicons name="camera" size={50} color="white" />
                </TouchableOpacity>

                {/* Pick Image from Gallery Button */}
                <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
                  <Entypo name="images" size={40} color="white" />
                </TouchableOpacity>
              </View>
              </CameraView>
            </View>
          )}
        </View>
      );
    
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  camera: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  buttonRow: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: 'white',
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
    padding: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
export default HomeScreen;