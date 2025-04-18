import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

const STORAGE_KEY = 'savedImages';

export default function GalleryScreen({ navigation, route }) {
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState('');
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    loadReceipts();

    if (route.params?.imageUri) {
      const imageUri = route.params.imageUri;
      addReceipt(imageUri, true); 
    }
  }, [route.params]);

  const loadReceipts = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        setReceipts(JSON.parse(saved));
      }
    } catch (err) {
      console.log('Error loading receipts:', err);
    }
  };

  const saveReceipts = async (updatedReceipts) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReceipts));
    } catch (err) {
      console.log('Error saving receipts:', err);
    }
  };

  const addReceipt = async (uri, parsed = false) => {
    const newReceipt = {
      id: Date.now().toString(),
      uri,
      date: new Date().toLocaleString(),
      name: 'Unnamed Receipt',
      parsed,
    };
    const updatedReceipts = [newReceipt, ...receipts];
    setReceipts(updatedReceipts);
    saveReceipts(updatedReceipts);
  };

  const toggleParsedStatus = (id) => {
    const updatedReceipts = receipts.map((receipt) =>
      receipt.id === id ? { ...receipt, parsed: !receipt.parsed } : receipt
    );
    setReceipts(updatedReceipts);
    saveReceipts(updatedReceipts);
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setNewName(name);
  };

  const handleSaveName = (id) => {
    const updatedReceipts = receipts.map((receipt) =>
      receipt.id === id ? { ...receipt, name: newName } : receipt
    );
    setReceipts(updatedReceipts);
    saveReceipts(updatedReceipts);
    setEditingId(null);
    setNewName('');
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Receipt',
      'Are you sure you want to delete this receipt?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedReceipts = receipts.filter((receipt) => receipt.id !== id);
            setReceipts(updatedReceipts);
            saveReceipts(updatedReceipts);
          },
        },
      ]
    );
  };

  const saveToPhone = async (uri) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'You need to grant permission to save images to your photo library.');
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Receipts', asset, false);
      Alert.alert('Success', 'Receipt saved to your photo library.');
    } catch (err) {
      console.log('Error saving receipt to photo library:', err);
      Alert.alert('Error', 'Failed to save receipt to your photo library.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receipts</Text>

      <FlatList
        data={receipts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.uri }} style={styles.image} />
            <Text style={styles.date}>{item.date}</Text>
            {editingId === item.id ? (
              <TextInput
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
                onSubmitEditing={() => handleSaveName(item.id)}
                autoFocus
              />
            ) : (
              <TouchableOpacity
                onPress={() => handleEdit(item.id, item.name || 'Unnamed')}
                activeOpacity={0.7}
                style={styles.touchable}
              >
                <Text style={styles.name}>{item.name || 'Unnamed'}</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.status}>
              Status: {item.parsed ? 'Parsed' : 'Not Parsed'}
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.greenButton]}
              onPress={() => toggleParsedStatus(item.id)}
            >
              <Text style={styles.buttonText}>
                Mark as {item.parsed ? 'Not Parsed' : 'Parsed'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.greenButton]}
              onPress={() => saveToPhone(item.uri)}
            >
              <Text style={styles.buttonText}>Save to Phone</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  item: {
    marginBottom: 16,
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    width: '80%',
  },
  touchable: {
    padding: 8,
  },
  status: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 8,
    alignItems: 'center',
  },
  greenButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
});
