import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import playsAudio from '../services/TTS-Service';

const TextRecognitionScreen = () => {
    const [text, setText] = useState('');

    const handlePress = () => {
      if (text) {
        playsAudio(text)
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
        <Button title="Convert to Speech" onPress={handlePress} />
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
    }
  });

export default TextRecognitionScreen;
