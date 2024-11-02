import axios from 'axios';
import { API_KEY } from '@env';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

const recognizeText = async (imageUri) => {
  try {
    // Convert image to base64
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Prepare request to Google Vision API
    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
      {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: 'TEXT_DETECTION',
              },
            ],
          },
        ],
      }
    );

    const textAnnotations = response.data.responses[0].textAnnotations;
    if (textAnnotations && textAnnotations.length > 0) {
      const detectedText = textAnnotations[0].description;
      // Alert.alert('Detected Text', detectedText);
      return detectedText
    } else {
      // Alert.alert('No text detected');
      return null
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Failed to process image');
  }
};

export default recognizeText;