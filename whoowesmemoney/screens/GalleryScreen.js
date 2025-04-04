// import React from 'react';
// import { View, Text, Button } from 'react-native';

// export default function GalleryScreen({ navigation }) {
//   return (
//     <View>
//       <Text>Gallery</Text>
//     </View>
//   );
// }

import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

export default function GalleryScreen() {
  const [receipts, setReceipts] = useState([
    { id: '1', uri: 'https://via.placeholder.com/150', name: 'Receipt 1' },
    { id: '2', uri: 'https://via.placeholder.com/150', name: 'Receipt 2' },
    { id: '3', uri: 'https://via.placeholder.com/150', name: 'Receipt 3' },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery</Text>
      <FlatList
        data={receipts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.uri }} style={styles.image} />
            <Text>{item.name}</Text>
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
});
