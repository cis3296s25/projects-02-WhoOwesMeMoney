import React, { useState } from 'react';
import { View, Button, Image, Text, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const GOOGLE_CLOUD_VISION_API_KEY = 'AIzaSyAN5Y8DR9r00Ssu7X5ihaLdjwwXYAf_BMs';

export default function App() {

  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState('');

  const pickImageAndScan = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setImage(uri);

    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
    await sendToGoogleVision(base64);
  };

  const takePhotoAndScan = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setImage(uri);

    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
    await sendToGoogleVision(base64);
  };

  const sendToGoogleVision = async (base64) => {
    const body = {
      requests: [
        {
          image: { content: base64 },
          features: [{ type: 'TEXT_DETECTION' }],
        },
      ],
    };

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
    const text = data.responses?.[0]?.fullTextAnnotation?.text || 'No text found';
    setOcrText(text);
  };

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Button title="Pick Image" onPress={pickImageAndScan} />
        <Button title="Take Photo" onPress={takePhotoAndScan} />
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <Text style={styles.label}>Scanned Text:</Text>
        <Text style={styles.result}>{ocrText}</Text>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({

  scroll: { flex: 1, backgroundColor: '#fff' },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    paddingTop: 70,
  },
  buttonContainer: {
    width: 300,
    height: 70,
    justifyContent: 'center',
    marginVertical: 20,
  },
  image: { width: 300, height: 400, marginVertical: 20 },
  label: { marginTop: 10, fontSize: 16, fontWeight: 'bold' },
  result: { marginTop: 10, fontSize: 16, textAlign: 'left', width: '100%' },
});
