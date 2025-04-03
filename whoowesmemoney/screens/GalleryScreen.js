import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function GalleryScreen({ navigation }) {
  return (
    <View>
      <Text>Gallery</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20, alignItems: 'center' },
  image: { width: 300, height: 400, marginVertical: 20 },
  label: { marginTop: 10, fontSize: 16, fontWeight: 'bold' },
  result: { marginTop: 10, fontSize: 16, textAlign: 'left', width: '100%' },
});
