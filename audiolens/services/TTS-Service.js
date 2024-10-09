import axios from "axios";
import { Buffer } from 'buffer';
import { Audio } from "expo-av";
import * as FileSystem from 'expo-file-system';
import { API_KEY } from '@env';

//Request permission to use audio 
const setAudio = async () => {
    await Audio.requestPermissionsAsync()
    await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
    });
}

const playsAudio = async (text) => {

    const GOOGLE_TTS_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;

    try {

        await setAudio()

        const response = await axios.post(
            GOOGLE_TTS_URL,
            {
                input: {text: text},
                voice: {languageCode: 'en-US', name: 'en-US-standard-A' , ssmlGender: "FEMALE"},
                audioConfig: {audioEncoding: 'MP3'},
            }
        )

        const audioContent = response.data.audioContent;

        const audioBuffer = Buffer.from(audioContent, "base64")

        const filePath = FileSystem.documentDirectory + "tts-output.mp3";
        await FileSystem.writeAsStringAsync(filePath, audioBuffer.toString("base64"), {
            encoding: FileSystem.EncodingType.Base64,
        })

        const { sound } = await Audio.Sound.createAsync({ uri: filePath })
        await sound.playAsync()

    } catch (e) {
        console.log("Error Detected In TTS-Service" + e);
    }

}

export default playsAudio