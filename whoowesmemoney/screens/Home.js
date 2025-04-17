import React, { useState } from 'react';
import { View, Image, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const GOOGLE_CLOUD_VISION_API_KEY = 'AIzaSyAN5Y8DR9r00Ssu7X5ihaLdjwwXYAf_BMs';

export default function Home({ navigation }) {
  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [foodItems, setFoodItems] = useState([]);

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
    const text = data.responses?.[0]?.fullTextAnnotation?.text || 'No text found';
    setOcrText(text);

    const items = extractFoodItems(text);
    setFoodItems(items);
  };

  const extractFoodItems = (ocrText) => {
    const lines = ocrText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');

    const mergedLines = [];
    for (let i = 0; i < lines.length; i++) {
      const currentLine = lines[i];
      const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
      if (!/\d+\.\d{2}/.test(currentLine) && /\d+\.\d{2}/.test(nextLine)) {
        mergedLines.push(`${currentLine} ${nextLine}`);
        i++;
      } else {
        mergedLines.push(currentLine);
      }
    }

    const ignoreKeywords = /tax|tip|total|subtotal|discount|change|payment|cash|visa|mastercard/i;
    const priceRegex = /\d+\.\d{2}/;
    return mergedLines.filter(line => priceRegex.test(line) && !ignoreKeywords.test(line));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={require('../assets/name.png')} style={styles.logo} />

        <TouchableOpacity style={styles.button} onPress={pickImageAndScan}>
          <Text style={styles.buttonText}>Pick Image and Scan</Text>
        </TouchableOpacity>

        {image && <Image source={{ uri: image }} style={styles.image} />}

        <Text style={styles.label}>🧾 Scanned Text:</Text>
        <Text style={styles.result}>{ocrText}</Text>

        <Text style={styles.label}>🍔 Food Items:</Text>
        {foodItems.map((item, index) => (
          <Text key={index} style={styles.result}>{item}</Text>
        ))}

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Person')}>
          <Text style={styles.buttonText}>Add a Debtor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Gallery', { foodItems, imageUri: image })}
        >
          <Text style={styles.buttonText}>Go to Gallery</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 300,
    height: 400,
    marginVertical: 20,
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  result: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'left',
    width: '100%',
  },
  logo: {
    width: 400,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginVertical: 8,
    width: '70%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
