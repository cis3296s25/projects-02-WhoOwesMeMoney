import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function GalleryScreen({ route }) {
  const { foodItems, imageUri } = route.params;

  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState('');
  const [items, setItems] = useState(
    foodItems.map((item, index) => ({
      id: `${index + 1}`,
      name: item,
    }))
  );

  const handleEdit = (id, name) => {
    setEditingId(id);
    setNewName(name);
  };

  const handleSave = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, name: newName } : item
      )
    );
    setEditingId(null);
    setNewName('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery</Text>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
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
                style={styles.touchable}
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
  image: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    resizeMode: 'contain',
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
});