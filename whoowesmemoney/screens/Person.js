import React, { useState, useRef, useCallBack, useEffect } from 'react';
import { View, Button, Image, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

let people = [];
let token = "tokenator";
// var listOwed = [];
// var amountOwed = [];
function DebtorPerson(name, amount, items = []) {
  this.name = name;
  this.owed = amount;
  this.items = items;
}


export default function Person({ navigation, route }){
  const [name, setName] = useState('');
  const [totalOwed, setTotalOwed] = useState(0);
  const [assignedItems, setAssignedItems] = useState([]);  


  useEffect(() => {
    let ignore = false;
    getDebtor();
    if (route.params?.selectedItems) {
      setAssignedItems(route.params.selectedItems);
    }
    
    if (route.params?.totalAmount) {
      setTotalOwed(route.params.totalAmount);
    }
    
  }, [route.params]);

  const createDebtor = () => {
    if (!name.trim()) {
      alert('Please enter a debtor name');
      return;
    }

  const existingPersonIndex = people.findIndex(p => p.name === name);

  if (existingPersonIndex !== -1) {
    // Update existing person
    const updatedPerson = { 
      ...people[existingPersonIndex],
      owed: people[existingPersonIndex].owed + totalOwed,
      items: [...people[existingPersonIndex].items, ...assignedItems]
    };
    
    people[existingPersonIndex] = updatedPerson;
    storeData();
    alert(`Updated ${name}'s debt to $${updatedPerson.owed.toFixed(2)}`);
  } else {
    // Create new person
    const newDebtor = new DebtorPerson(name, totalOwed, assignedItems);
    people.push(newDebtor);
    storeData();
    alert(`Added ${name} with debt $${totalOwed.toFixed(2)}`);
  }
  
  console.log('Current people:', people);
  
  setName('');
  setTotalOwed(0);
  setAssignedItems([]);
  
  navigation.navigate('Home');
};

const viewDebtorDetails = () => {
  getDebtor();
  if (!name.trim()) {
    alert('Please enter a debtor name to check');
    return;
  }
  
  const person = people.find(p => p.name === name);
  
  if (person) {
    setTotalOwed(person.owed);
    setAssignedItems(person.items || []);
  } else {
    alert('No debtor found with that name');
  }
};

  

  const storeData = async () =>{
    try{
      await AsyncStorage.setItem(
        token,
        JSON.stringify(people),
      );
    console.log("success!");
    } catch (error){
      // Error
      console.log(error);
    }
  };

  const getDebtor = async () =>{
    try {
      const value = await AsyncStorage.getItem(token);
      if (value !== null) {
        // We have data!!
        people = (JSON.parse(value));
        console.log(people);
      }
    } catch (error) {
      // Error retrieving data
      console.log("failure in getting debtors");
    }
  }; 
  
  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Button title="Back to Home" onPress={() => navigation.navigate('Home')}/>
        
        <Text style={styles.sectionTitle}>Debtor Information</Text>
        
        <Text style={styles.label}>Enter debtor's name:</Text>
        <TextInput 
          style={styles.input}
          value={name}
          placeholder="e.g. John Doe"
          onChangeText={(text) => setName(text)}
        />
        
        {assignedItems.length > 0 && (
          <View style={styles.itemsContainer}>
            <Text style={styles.sectionTitle}>Assigned Items</Text>
            
            {assignedItems.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
              </View>
            ))}
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>${totalOwed.toFixed(2)}</Text>
            </View>
          </View>
        )}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={createDebtor}
          >
            <Text style={styles.buttonText}>
              {people.some(p => p.name === name) ? 'Update Debtor' : 'Create Debtor'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={viewDebtorDetails}
          >
            <Text style={styles.buttonText}>Check Debt</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

  

  const styles = StyleSheet.create({
    scroll: { 
      flex: 1, 
      backgroundColor: '#fff' 
    },
    container: { 
      padding: 20, 
      alignItems: 'center' 
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
      alignSelf: 'flex-start'
    },
    label: { 
      marginTop: 10, 
      fontSize: 16, 
      alignSelf: 'flex-start' 
    },
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      padding: 10,
      marginTop: 5,
      marginBottom: 15
    },
    itemsContainer: {
      width: '100%',
      marginTop: 10,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      padding: 10
    },
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#eee'
    },
    itemDescription: {
      flex: 1,
      fontSize: 16
    },
    itemPrice: {
      fontSize: 16,
      fontWeight: '500'
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: '#000'
    },
    totalLabel: {
      fontSize: 18,
      fontWeight: 'bold'
    },
    totalAmount: {
      fontSize: 18,
      fontWeight: 'bold'
    },
    buttonContainer: {
      width: '100%',
      marginTop: 10
    },
    button: {
      backgroundColor: '#4CAF50',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 20,
      marginVertical: 8,
      width: '100%',
      alignItems: 'center'
    },
    secondaryButton: {
      backgroundColor: '#4CAF50'
    },
    buttonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16
    }
  });