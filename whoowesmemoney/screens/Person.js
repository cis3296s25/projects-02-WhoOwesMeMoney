import React, { useState, useEffect } from 'react';
import { View, Button, Image, Text, ScrollView, StyleSheet, TextInput, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

// let full = "First Last";
// let totalOwed = 0.00;
// let peopleOwed = " ";
// let token = "tokenator";
// // var listOwed = [];
// // var amountOwed = [];
// var people = [];
// function newerPerson(word, number){
//   this.fullname = word;
//   this.owed = number;
// }

const STORAGE_KEY = 'tokenator'


export default function Person({ navigation }){
  const [nameHolder, setNameHolder] = useState('');
  const [person, setPerson] = useState([{}]);
  const [debtors, setDebtors] = useState([]);
  // getDebtor();  

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

  const handleSubmit = () => {
    if (nameHolder.trim() === '') {
      alert('Please Enter a Name!');
      return;
    }

    // Check if already exists
    if (debtors.find((debtor) => debtor.fullname === nameHolder.trim())) {
      alert('Debtor already exists!');
      return;
    }

    const newDebtor = {
      fullname: nameHolder.trim(),
      owed: 0.0,
    };

    const updatedList = [...debtors, newDebtor];
    setDebtors(updatedList);
    saveDebtors(updatedList);
    setNameHolder('');
  };
  const [editingIndex, setEditingIndex] = useState(null);


  const renderDebtor = ({ item, index }) => {
    const handleAmountChange = (text) => {
      const updatedDebtors = [...debtors];
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
        <Text style={styles.debtorName}>{item.fullname}</Text>
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


  // const handleSubmit = (debtorName) => {
  //   //setName(debtorName);
  //   if (debtorName === '') {
  //       alert("Please Enter Something!");
  //   } else {
  //     let full = debtorName;
  //   newPerson(full, totalOwed); 
  //   //setDebtors(people);
  //   storeData();
  //   }
  // };
  
  // const handleGet = () => {
  //   peopleOwed = people[0];
  // };

  // const storeData = async () =>{
  //   try{
  //     await AsyncStorage.setItem(
  //       token,
  //       JSON.stringify(people),
  //     );
  //   console.log("success!");
  //   } catch (error){
  //     // Error
  //     console.log(error);
  //   }
  // }

  

  const readList = 'PLACEHOLDER FOR DISPLAYING DEBTOR LIST';
  
    return (
        <View style={styles.scroll}>
              <View style={styles.container}>
                <Button title="Back to Home" onPress={() => navigation.navigate('Home')}/>
                <Text>Enter debtor's name:</Text>
                <TextInput 
                style={styles.input}
                placeholder={"e.g. John Doe"}
                onChangeText={(text) => setNameHolder(text)}
                />
                <Button title="Make new Debtor" onPress={()=>handleSubmit(nameHolder)}/>
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


// function newPerson(thing, number){
//   for(let i = 0; i<people.length; i++){
//     if(thing == people[i].fullname){
//       return;
//     }
//   }
//     var debtor = new newerPerson(thing, number);
//     people.push(debtor);
//     console.log(people);
// };

  /* function getDebtors(){
    for(let i = 0;i< people.length; i++){
      // peopleOwed = localStorage.getItem(people[i]);
    }
  }; */

  // async function getDebtor(){
  //   try {
  //     const value = await AsyncStorage.getItem(token);
  //     if (value !== null) {
  //       // We have data!!
  //       people = (JSON.parse(value));
  //     }
  //   } catch (error) {
  //     // Error retrieving data
  //     console.log("failure in getting debtors");
  //   }
  // }; 

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