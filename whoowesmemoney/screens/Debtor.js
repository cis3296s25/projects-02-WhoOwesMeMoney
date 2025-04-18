import React, { useState, useEffect } from 'react';
import { View, Button, Image, Text, ScrollView, StyleSheet, TextInput, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const STORAGE_KEY = 'tokenator'


export default function Debtor({ navigation, route }){
  const [nameHolder, setNameHolder] = useState('');
  const [person, setPerson] = useState([{}]);
  const [debtors, setDebtors] = useState([]); 

  useEffect(() => {
    loadDebtors();
  }, []);

  const loadDebtors = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        setDebtors(JSON.parse(saved));
      }
    } catch (err) {
      console.log('Error loading debtors:', err);
    }
  };

  const saveDebtors = async (updatedList) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (err) {
      console.log('Error saving debtors:', err);
    }
  };


  const [editingIndex, setEditingIndex] = useState(null);


  const renderDebtor = ({ item, index }) => {
    const handleAmountChange = (text) => {
      let floatHolder = 0.00;
      const updatedDebtors = [...debtors];
      floatHolder = updatedDebtor[index].owed.toFixed(2)
      updatedDebtors[index].owed = parseFloat(text) || 0;
      setDebtors(updatedDebtors);
      saveDebtors(updatedDebtors);
    };
  
    const deleteDebtor = () => {
      const updatedDebtors = [...debtors];
      updatedDebtors.splice(index, 1); // remove debtor at index
      setDebtors(updatedDebtors);
      saveDebtors(updatedDebtors);
    };

    const isEditing = editingIndex === index;
  
    return (
      <View style={styles.debtorRow}>
        <Text style={styles.debtorName}>{item.name}</Text>
          <View style={styles.amountWrapper}>
            <Text style={styles.dollarSign}>$</Text> 
              <TextInput
                style={[styles.debtorAmount, !isEditing && styles.debtorAmountInactive]}
                keyboardType="numeric"
                value={item.owed.toString()}
                onChangeText={handleAmountChange}
                onFocus={() => setEditingIndex(index)}
                onBlur={() => setEditingIndex(null)}
              />
          </View>
        <Text style={styles.deleteBtn} onPress={deleteDebtor}> 🗑️ </Text>
      </View>
    );
  };

  

  const readList = 'PLACEHOLDER FOR DISPLAYING DEBTOR LIST';
  
    return (
        <View style={styles.scroll}>
              <View style={styles.container}>
                <Button title="Back to Debtor Creation" onPress={() => navigation.navigate('Person')}/>
                <Text style={styles.label}>These are my debtors and what they owe:</Text>
                <FlatList
                  data={debtors}
                  renderItem={renderDebtor}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
         </View>
    )
};

  const styles = StyleSheet.create({
    scroll: { flex: 1, backgroundColor: '#fff' },
    container: { padding: 20, alignItems: 'center' },
    image: { width: 300, height: 400, marginVertical: 20 },
    label: { marginTop: 10, fontSize: 16, fontWeight: 'bold' },
    result: { marginTop: 10, fontSize: 16, textAlign: 'left', width: '100%' },
    input: {
      borderWidth: 1,
      borderColor: '#aaa',
      padding: 10,
      marginVertical: 10,
      width: '100%',
      borderRadius: 5,
    },
    amountInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 5,
      marginTop: 5,
      width: '50%',
      backgroundColor: '#fff'
    },
    amountWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingHorizontal: 6,
      borderRadius: 5,
    },
    dollarSign: {
      fontSize: 16,
      marginRight: 2,
      color: '#000',
    },
    
    debtorAmountInactive: {
      borderWidth: 0,
      backgroundColor: 'transparent',
    },
    debtorItem: {
      backgroundColor: '#f0f0f0',
      padding: 10,
      marginVertical: 5,
      width: '100%',
      borderRadius: 5,
    },
    debtorText: {
      fontSize: 16,
    },

    debtorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      marginVertical: 5,
      backgroundColor: '#f0f0f0',
      borderRadius: 5,
      width: '100%',
    },
    
    debtorName: {
      fontSize: 16,
      fontWeight: '500',
      flex: 1,
    },
    
    debtorAmount: {
      width: 80,
      padding: 5,
      backgroundColor: '#fff',
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      textAlign: 'center',
      fontSize: 16,
    },
    
  });