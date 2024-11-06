import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Text, Button, Image, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { RootStackParamList } from "../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import * as ImagePicker from 'expo-image-picker';
import recognizeText from "../services/OCR-Service";
import { CameraProps, CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons, AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import { Grid2x2CheckIcon, Grid2x2X, Images, Zap, ZapOff, RefreshCw } from "lucide-react-native";
import { BlurView } from "expo-blur";


// import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';


type HomeScreenProp = StackNavigationProp<RootStackParamList, 'Home'>;


const HomeScreen = () => {

    const navigation = useNavigation<HomeScreenProp>();

    const cameraRef = useRef<CameraView>(null);
    const [facing, setFacing] = useState<CameraProps["facing"]>("back");
    const [flashMode, setFlashMode] = useState<"on" | "off">("off");
    const [autofocus, setAutofocus] = useState<"on" | "off">("off");
    const [showGrid, setShowGrid] = useState(false);
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
  
    //Toggle Camera Facing Direction (Front)(Back)//////////////////////////////////////////////////

    function toggleCameraFacing() {
      setFacing((current) => (current === "back" ? "front" : "back"));
    }
    
    //Toggle Flash mode (on)-(off)-(auto)///////////////////////////////////////////////////////////

    const toggleFlashMode = () => {
      setFlashMode(prevFlashMode => {
        if (prevFlashMode === "off") return "on";
        // if (prevFlashMode === "on") return "auto";
        return "off";
      });
      
    }
    // Toggle grid/////////////////////////////////////////////////////////////////////////////////

   

    //AutoFocus system ////////////////////////////////////////////////////////////////////////////

    const handleTapToFocus = () => {
      setAutofocus('on');
      setTimeout(() => setAutofocus('off'), 500);
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
                flash={flashMode}
                autofocus={autofocus}
              >
                <BlurView intensity={50} style={styles.topButtonRowBlur}>
                  <View style={styles.topButtonRow}>
                    <TouchableOpacity onPress={() => setShowGrid(prev => !prev)} style={styles.flashButton}>
                      {showGrid ? <Grid2x2CheckIcon size={40} color="white" /> : <Grid2x2X size={40} color="white" />}
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={toggleFlashMode} style={styles.flashButton}>
                      {flashMode === "on" ? <Zap size={40} color="white" /> : <ZapOff size={40} color="white" />}
                    </TouchableOpacity>
                  </View>
                </BlurView>
                {showGrid && (
                  <View style={styles.gridOverlay}>
                    {/* Horizontal grid lines */}
                    <View style={[styles.gridLine, styles.horizontalLine, { top: '33%' }]} />
                    <View style={[styles.gridLine, styles.horizontalLine, { top: '66%' }]} />
              
                    {/* Vertical lines */}
                    <View style={[styles.gridLine, styles.verticalLine, { left: '33%' }]} />
                    <View style={[styles.gridLine, styles.verticalLine, { left: '66%' }]} />
                </View>
                )}
               
                <TouchableOpacity style={styles.cameraTouchArea} onPress={handleTapToFocus}/>
                <TouchableOpacity 
                  style={styles.captureButtonContainer}
                  onPress={async () => {
                    const photo = await cameraRef.current?.takePictureAsync();
                    setImageUri(photo!.uri);
                    console.log(JSON.stringify(photo));
                  }}>
                  <BlurView intensity={50} style={styles.captureButtonBlur}>
                    <View
                      style={styles.captureButton}
                      
                    />
                  </BlurView>
                </TouchableOpacity>
                <BlurView intensity={50} style={styles.bottomButtonRowBlur}>
                  {/* Camera control buttons */}
                  <View style={styles.buttonRow}>
                    {/* Flip Camera Button */}
                    
                    <TouchableOpacity onPress={toggleCameraFacing} style={styles.iconButton}>
                      <RefreshCw size={40} color="white" />
                    </TouchableOpacity>
                    
                    {/* Pick Image from Gallery Button */}
                    <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
                      <Images size={40} color="white" />
                    </TouchableOpacity>
                    
                  </View>
                </BlurView>
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
  topButtonRowBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    borderBottomLeftRadius: 400,
    borderBottomRightRadius: 400,
    overflow: 'hidden', // Required for the blur effect to respect the radius
    justifyContent: 'center',
  },
  
  // bottomButtonRowBlur: {
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   height: 80,
  //   borderTopLeftRadius: 400,
  //   borderTopRightRadius: 400,
  //   overflow: 'hidden', // Required for the blur effect to respect the radius
  //   justifyContent: 'center',
  // },

  bottomButtonRowBlur: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80, // Adjust to create a larger blurred area if needed
    borderTopLeftRadius: 400,
    borderTopRightRadius: 400,
    overflow: 'hidden',
    justifyContent: 'center',
    zIndex: 1, // Ensure this is lower than the capture button
  },
  topButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 30, // Adjust to control how much the capture button overlaps the blur container
    alignSelf: 'center',
    zIndex: 2,
  },
  
  captureButtonBlur: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // captureButton: {
  //   width: 70,
  //   height: 70,
  //   borderRadius: 35,
  //   backgroundColor: 'white', 
  // },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    opacity: 0.9,
    borderWidth: 5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  cameraTouchArea: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  flashButton: {

    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
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
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 100,
    

  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  horizontalLine: {
    width: '100%',
    height: 2,
  },
  verticalLine: {
    height: '100%',
    width: 2,
  },
  // horizontalLine: {
  //   position: 'absolute',
  //   backgroundColor: 'rgba(255, 255, 255, 0.5)',
  //   height: 1,
  //   width: '100%',
  //   top: '33%',
  // },
  // verticalLine: {
  //   position: 'absolute',
  //   backgroundColor: 'rgba(255, 255, 255, 0.5)',
  //   width: 1,
  //   height: '100%',
  //   left: '33%',
  // },
  
});
export default HomeScreen;