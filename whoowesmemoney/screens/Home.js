import React, { useState } from 'react';
<<<<<<< Updated upstream
import { View, Button, Image, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
=======
import { View, Image, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native';
>>>>>>> Stashed changes
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';


const GOOGLE_CLOUD_VISION_API_KEY = 'AIzaSyAN5Y8DR9r00Ssu7X5ihaLdjwwXYAf_BMs';

export default function Home({navigation}) {
  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState('');
<<<<<<< Updated upstream
=======
  const [foodItems, setFoodItems] = useState([]); // For scanned items
  const [manualItems, setManualItems] = useState([]); // For manually added items
  const [restaurantName, setRestaurantName] = useState('');
  const [manualItemName, setManualItemName] = useState('');
  const [manualItemPrice, setManualItemPrice] = useState('');
  const [showManualInput, setShowManualInput] = useState(false); // Toggle for manual input visibility
  const [editItemId, setEditItemId] = useState(null); // Track the item being edited
  const [editItemName, setEditItemName] = useState('');
  const [editItemPrice, setEditItemPrice] = useState('');
  const [divideBy, setDivideBy] = useState(''); // Number of people to divide by
>>>>>>> Stashed changes

  const pickImageAndScan = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setImage(uri);

    // Save the image to the gallery
    await saveReceiptToGallery(uri, false);

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

    // Save the image to the gallery
    await saveReceiptToGallery(uri, false);

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
    console.log(JSON.stringify(data, null, 2)); // 👈 Add this line
    const text = data.responses?.[0]?.fullTextAnnotation?.text || 'No text found';
    setOcrText(text);
  };


<<<<<<< Updated upstream

  return (
    <SafeAreaView style={styles.scroll}>
      <View style={styles.container}>
        <Button title="Pick Image and Scan" onPress={pickImageAndScan} />
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <Text style={styles.label}>🧾 Scanned Text:</Text>
        <Text style={styles.result}>{ocrText}</Text>
      </View>
      <Button title="Add a Debtor" onPress={() => navigation.navigate('Person')} />
      <Button title="Go to Gallery" onPress={() => navigation.navigate('Gallery')} />
=======
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

    const ignoreKeywords = /tax|tip|total|subtotal|discount|change|payment|cash|visa|mastercard|location|address/i;
    const priceRegex = /\d+\.\d{2}/;

    const foodItemObjects = mergedLines
      .filter(line => priceRegex.test(line) && !ignoreKeywords.test(line))
      .map(line => {
        const price = parseFloat(line.match(priceRegex)[0]);
        const description = line.replace(priceRegex, '').trim();

        return {
          id: Math.random().toString(36).substring(2, 9),
          description,
          price: parseFloat(price.toFixed(2)), // Ensure price is a number rounded to 2 decimals
          originalPrice: parseFloat(price.toFixed(2)), // Store the original price
          date: new Date().toLocaleDateString(),
          selected: false,
        };
      });

    return foodItemObjects;
  };

  const toggleItemSelection = (id, isManual = false) => {
    if (isManual) {
      setManualItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, selected: !item.selected } : item
        )
      );
    } else {
      setFoodItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, selected: !item.selected } : item
        )
      );
    }
  };

  const saveReceiptToGallery = async (uri, parsed = false) => {
    try {
      const newReceipt = {
        id: Date.now().toString(),
        uri,
        date: new Date().toLocaleString(),
        name: 'Unnamed Receipt',
        parsed,
      };

      const savedReceipts = await AsyncStorage.getItem('savedImages');
      const receipts = savedReceipts ? JSON.parse(savedReceipts) : [];
      const updatedReceipts = [newReceipt, ...receipts];

      await AsyncStorage.setItem('savedImages', JSON.stringify(updatedReceipts));
      console.log('Receipt saved to gallery:', newReceipt);
    } catch (err) {
      console.error('Error saving receipt to gallery:', err);
    }
  };

  const addManualItem = () => {
    if (!manualItemName || !manualItemPrice) {
      alert('Please enter both name and price for the item.');
      return;
    }

    const newItem = {
      id: Math.random().toString(36).substring(2, 9),
      description: manualItemName,
      price: parseFloat(manualItemPrice).toFixed(2), // Ensure price is a number rounded to 2 decimals
      originalPrice: parseFloat(manualItemPrice).toFixed(2), // Store original price
      date: new Date().toLocaleDateString(),
      selected: true, // Auto-highlight the item
    };

    setManualItems((prevItems) => [...prevItems, newItem]);
    setManualItemName('');
    setManualItemPrice('');
  };

  const deleteItem = (id, isManual = false) => {
    if (isManual) {
      setManualItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } else {
      setFoodItems((prevItems) => prevItems.filter((item) => item.id !== id));
    }
  };

  const clearAll = () => {
    Alert.alert(
      'Clear All',
      'Are you sure you want to clear all items?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setFoodItems([]);
            setManualItems([]);
            setImage(null);
            setOcrText('');
          },
        },
      ]
    );
  };

  const navigateToDebtorWithItems = () => {
    const selectedFoodItems = foodItems.filter((item) => item.selected);
    const selectedManualItems = manualItems.filter((item) => item.selected);

    if (selectedFoodItems.length === 0 && selectedManualItems.length === 0) {
      alert('Please select at least one food item');
      return;
    }

    const totalAmount = [...selectedFoodItems, ...selectedManualItems]
      .reduce((sum, item) => sum + parseFloat(item.price || 0), 0)
      .toFixed(2);

    navigation.navigate('Person', {
      selectedItems: [...selectedFoodItems, ...selectedManualItems],
      totalAmount,
      restaurantName,
    });
  };

  const startEditingItem = (item) => {
    setEditItemId(item.id);
    setEditItemName(item.description);
    setEditItemPrice(item.price.toString());
    setDivideBy(''); // Reset divide input
  };

  const saveEditedItem = () => {
    setFoodItems((prevItems) =>
      prevItems.map((item) =>
        item.id === editItemId
          ? { ...item, description: editItemName, price: parseFloat(editItemPrice) }
          : item
      )
    );
    setEditItemId(null);
    setEditItemName('');
    setEditItemPrice('');
  };

  const divideItemPrice = (value) => {
    const divisor = parseInt(value, 10);

    // If the input is empty, reset the price to the original price
    if (!value) {
      const item = foodItems.find((item) => item.id === editItemId);
      if (item) {
        setEditItemPrice(item.originalPrice.toString());
      }
      setDivideBy(''); // Clear the divideBy state
      return;
    }

    if (!divisor || divisor <= 0) {
      setDivideBy(''); // Reset the input if invalid
      return;
    }

    setDivideBy(value); // Update the divideBy state

    // Update the editItemPrice dynamically
    const item = foodItems.find((item) => item.id === editItemId);
    if (item) {
      const newPrice = parseFloat((item.originalPrice / divisor).toFixed(2));
      setEditItemPrice(newPrice.toString());
    }
  };

  const divideManualItemPrice = (id, value) => {
    const divisor = parseInt(value, 10);

    // If the input is empty, reset the price to the original price
    if (!value) {
      setManualItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, price: item.originalPrice } : item
        )
      );
      return;
    }

    if (!divisor || divisor <= 0) {
      return; // Do nothing if the input is invalid
    }

    setManualItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, price: parseFloat((item.originalPrice / divisor).toFixed(2)) }
          : item
      )
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={require('../assets/name.png')} style={styles.logo} />

        {/* Top Buttons Section */}
        <View style={styles.borderedContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImageAndScan}>
            <Text style={styles.buttonText}>Pick Existing Image</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={takePhotoAndScan}>
            <Text style={styles.buttonText}>Take New Photo</Text>
          </TouchableOpacity>
        </View>

        {image && <Image source={{ uri: image }} style={styles.image} />}

        {/* Food Items Section */}
        {foodItems.length > 0 && (
          <>
            <Text style={styles.label}>Scanned Food Items:</Text>
            <View style={styles.foodItemsContainer}>
              {foodItems.map((item) => (
                <View key={item.id} style={styles.foodItemContainer}>
                  {editItemId === item.id ? (
                    <>
                      <TextInput
                        style={styles.input}
                        value={editItemName}
                        onChangeText={setEditItemName}
                        placeholder="Edit item name"
                      />
                      <TextInput
                        style={styles.input}
                        value={editItemPrice}
                        onChangeText={setEditItemPrice}
                        placeholder="Edit item price"
                        keyboardType="numeric"
                      />
                      <TextInput
                        style={styles.input}
                        value={divideBy}
                        onChangeText={divideItemPrice}
                        placeholder="Divide by (number of people)"
                        keyboardType="numeric"
                      />
                      <TouchableOpacity style={styles.button} onPress={saveEditedItem}>
                        <Text style={styles.buttonText}>Save</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={[styles.foodItem, item.selected && styles.selectedItem]}
                        onPress={() => toggleItemSelection(item.id)}
                      >
                        <Text style={styles.foodItemText}>
                          {item.description} - ${item.price} ({item.date})
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => startEditingItem(item)}
                      >
                        <Text style={styles.buttonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#FF6347' }]}
                        onPress={() => deleteItem(item.id)}
                      >
                        <Text style={styles.buttonText}>Delete</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              ))}
            </View>
          </>
        )}

        {/* Manual Item Addition Section */}
        <TouchableOpacity
          style={[styles.button, { marginBottom: 10 }]}
          onPress={() => setShowManualInput(!showManualInput)}
        >
          <Text style={styles.buttonText}>
            {showManualInput ? 'Hide Manual Items' : 'Add Manual Items'}
          </Text>
        </TouchableOpacity>

        {showManualInput && (
          <View style={styles.borderedContainer}>
            <Text style={styles.label}>Add Manual Items:</Text>
            <TextInput
              style={styles.input}
              placeholder="Item name"
              value={manualItemName}
              onChangeText={setManualItemName}
            />
            <TextInput
              style={styles.input}
              placeholder="Item price"
              value={manualItemPrice}
              onChangeText={setManualItemPrice}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={addManualItem}>
              <Text style={styles.buttonText}>Add Item</Text>
            </TouchableOpacity>

            {/* Display Added Manual Items */}
            {manualItems.length > 0 && (
              <View style={styles.manualItemsContainer}>
                {manualItems.map((item) => (
                  <View key={item.id} style={styles.foodItemContainer}>
                    <TouchableOpacity
                      style={[styles.foodItem, item.selected && styles.selectedItem]}
                      onPress={() => toggleItemSelection(item.id, true)}
                    >
                      <Text style={styles.foodItemText}>
                        {item.description} - ${item.price} ({item.date})
                      </Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.input}
                      placeholder="Divide by (number of people)"
                      keyboardType="numeric"
                      onChangeText={(value) => divideManualItemPrice(item.id, value)}
                    />
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: '#FF6347' }]}
                      onPress={() => deleteItem(item.id, true)}
                    >
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Assign Button */}
        {(foodItems.some((item) => item.selected) || manualItems.some((item) => item.selected)) && (
          <TouchableOpacity
            style={[styles.button, styles.assignButton]}
            onPress={navigateToDebtorWithItems}
          >
            <Text style={styles.buttonText}>Assign Items to Debtor</Text>
          </TouchableOpacity>
        )}

        {/* Clear All Button */}
        <TouchableOpacity style={[styles.button, { backgroundColor: '#FF6347' }]} onPress={clearAll}>
          <Text style={styles.buttonText}>Clear All</Text>
        </TouchableOpacity>

        {/* Navigation Buttons */}
        <View style={styles.borderedContainer}>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Debtor')}
          >
            <Text style={styles.buttonText}>Debtors</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Gallery')}
          >
            <Text style={styles.buttonText}>Receipt Gallery</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
>>>>>>> Stashed changes
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
<<<<<<< Updated upstream
  scroll: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20, alignItems: 'center' },
  container: { padding: 20, alignItems: 'center' },
  image: { width: 300, height: 400, marginVertical: 20 },
  label: { marginTop: 10, fontSize: 16, fontWeight: 'bold' },
  result: { marginTop: 10, fontSize: 16, textAlign: 'left', width: '100%' },
=======
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 400,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  borderedContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginVertical: 20,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  image: {
    width: 300,
    height: 400,
    marginVertical: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    width: '100%',
    fontSize: 16,
    backgroundColor: '#fff',
  },
  foodItemsContainer: {
    width: '100%',
    marginTop: 10,
  },
  foodItemContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
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
  manualItemsContainer: {
    marginTop: 20,
    width: '100%',
  },
  assignButton: {
    marginTop: 16,
    backgroundColor: '#4CAF50',
    alignSelf: 'center',
    width: '80%',
    paddingVertical: 12,
    borderRadius: 20,
  },
>>>>>>> Stashed changes
});