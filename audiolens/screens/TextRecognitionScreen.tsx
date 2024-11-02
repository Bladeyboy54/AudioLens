import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import playsAudio from '../services/TTS-Service';
import {  RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from "../types/navigation";
import { StackNavigationProp } from '@react-navigation/stack';

type TextRecognitionRouteProp = RouteProp<RootStackParamList, "TextRecognition">;
type NavigationProp = StackNavigationProp<RootStackParamList, "TextRecognition">;

const TextRecognitionScreen = () => {

  const route = useRoute<TextRecognitionRouteProp>();
  const navigation = useNavigation<NavigationProp>();

  const [text, setText] = useState('');
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    if (route.params?.ocrText) {
      setText(route.params.ocrText)
    }
  }, [route.params?.ocrText]);

  const handlePress = async () => {
    if ( text && !loading ) {
      setLoading(true);
      await playsAudio(text);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter text"
        value={text}
        onChangeText={setText}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handlePress}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Processing..." : "Convert to Speech"}</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="small" color="#0000ff" />}

      <TouchableOpacity  
        onPress={() => navigation.navigate("Home")}
        style={styles.backButton}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
      
    </View>
  );
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    marginBottom: 20
  },
  backButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    width: '60%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    width: '60%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a9a9a9',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default TextRecognitionScreen;
