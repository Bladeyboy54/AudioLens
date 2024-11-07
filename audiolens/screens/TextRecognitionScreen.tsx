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

      <Text style={styles.header}>Text Recognition</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter text"
        value={text}
        onChangeText={setText}
        multiline={true}
        numberOfLines={4}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handlePress}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Processing..." : "Convert to Speech"}</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="rgba(255, 184, 84, 1)" />}

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
    backgroundColor: '#1C1C1E',
    // alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    color: 'rgba(255, 184, 84, 1)',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 84, 1)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    color: '#FFF',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: 'rgba(60, 42, 106, 1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'rgba(60, 42, 106, 1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: '#a9a9a9',
  },
  buttonText: {
    color: 'rgba(255, 184, 84, 1)',
    fontSize: 18,
    fontWeight: 'bold',
  },

});

export default TextRecognitionScreen;
