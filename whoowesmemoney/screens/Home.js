import React, { useState } from 'react';
import { View, Image, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Modal, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const GOOGLE_CLOUD_VISION_API_KEY = 'AIzaSyAN5Y8DR9r00Ssu7X5ihaLdjwwXYAf_BMs';

export default function Home({ navigation }) {
  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

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
    
    // Filter items and convert to structured objects
    const foodItemObjects = mergedLines
      .filter(line => priceRegex.test(line) && !ignoreKeywords.test(line))
      .map(line => {
        const price = parseFloat(line.match(priceRegex)[0]);
        
        const description = line.replace(priceRegex, '').trim();
        
        return {
          id: Math.random().toString(36).substring(2, 9),
          description,
          price,
          selected: false
        };
      });
      
    return foodItemObjects;
  };

  const toggleItemSelection = (id) => {
    setFoodItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const navigateToDebtorWithItems = () => {
    const selectedFoodItems = foodItems.filter(item => item.selected);
    if (selectedFoodItems.length === 0) {
      alert('Please select at least one food item');
      return;
    }
    
    // Calculate total amount
    const totalAmount = selectedFoodItems.reduce((sum, item) => sum + item.price, 0);
    
    // Navigate to Person screen with selected items and total
    navigation.navigate('Person', { 
      selectedItems: selectedFoodItems,
      totalAmount
    });
    
    setModalVisible(false);
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
        {foodItems.length > 0 ? (
          <View style={styles.foodItemsContainer}>
            {foodItems.map((item, index) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.foodItem, item.selected && styles.selectedItem]}
                onPress={() => toggleItemSelection(item.id)}
              >
                <Text style={styles.foodItemText}>
                  {item.description} - ${item.price.toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={[styles.button, styles.assignButton]} 
              onPress={navigateToDebtorWithItems}
            >
              <Text style={styles.buttonText}>Assign Selected Items to Debtor</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.result}>No food items detected</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Person')}>
          <Text style={styles.buttonText}>Add a Debtor</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Gallery')}>
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
  foodItemsContainer: {
    width: '100%',
    marginTop: 10,
  },
  foodItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedItem: {
    backgroundColor: '#e0f7e0',
    borderColor: '#4CAF50',
  },
  foodItemText: {
    fontSize: 16,
  },
  assignButton: {
    marginTop: 16,
    backgroundColor: '#4CAF50',
  },
});
