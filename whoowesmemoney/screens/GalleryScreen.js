import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function GalleryScreen() {
  const [receipts, setReceipts] = useState([
    { id: '1', uri: 'https://via.placeholder.com/150', name: 'Receipt 1' },
    { id: '2', uri: 'https://via.placeholder.com/150', name: 'Receipt 2' },
    { id: '3', uri: 'https://via.placeholder.com/150', name: 'Receipt 3' },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState('');

  const handleEdit = (id, name) => {
    setEditingId(id);
    setNewName(name);
  };

  const handleSave = (id) => {
    setReceipts((prevReceipts) =>
      prevReceipts.map((receipt) =>
        receipt.id === id ? { ...receipt, name: newName } : receipt
      )
    );
    setEditingId(null);
    setNewName('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery</Text>
      <FlatList
        data={receipts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.uri }} style={styles.image} />
            {editingId === item.id ? (
              <TextInput
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
                onSubmitEditing={() => handleSave(item.id)}
                autoFocus
              />
            ) : (
              <TouchableOpacity
                onPress={() => handleEdit(item.id, item.name)}
                activeOpacity={0.7}
                style={styles.touchable} // Added style for better touch area
              >
                <Text style={styles.name}>{item.name}</Text>
              </TouchableOpacity>
            )}
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
  item: {
    marginBottom: 16,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 8,
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
    width: 150,
  },
  touchable: {
    padding: 8, // Add padding to make the touchable area larger
  },
});
