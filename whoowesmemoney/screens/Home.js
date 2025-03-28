import React, { useState } from 'react';
import { View, Button, Image, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
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
    console.log(JSON.stringify(data, null, 2)); // 👈 Add this line
    const text = data.responses?.[0]?.fullTextAnnotation?.text || 'No text found';
    setOcrText(text);
  };


  return (
    <SafeAreaView style={styles.scroll}>
      <View style={styles.container}>
        <Button title="Pick Image and Scan" onPress={pickImageAndScan} />
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <Text style={styles.label}>🧾 Scanned Text:</Text>
        <Text style={styles.result}>{ocrText}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20, alignItems: 'center' },
  image: { width: 300, height: 400, marginVertical: 20 },
  label: { marginTop: 10, fontSize: 16, fontWeight: 'bold' },
  result: { marginTop: 10, fontSize: 16, textAlign: 'left', width: '100%' },
});
