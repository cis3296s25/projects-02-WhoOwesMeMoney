import React, { useState, useRef, useCallBack } from 'react';
import { View, Button, Image, Text, ScrollView, StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

let full = "First Last";
let totalOwed = 0.00;
let peopleOwed = " ";
let token = "tokenator";
// var listOwed = [];
// var amountOwed = [];
var people = [];
function newerPerson(word, number){
  this.fullname = word;
  this.owed = number;
}


export default function Person({ navigation }){
  const [nameHolder, setNameHolder] = useState('');
  const [person, setPerson] = useState([{}]);
  const [debtors, setDebtors] = useState([]);
  getDebtor();  

  const handleSubmit = (debtorName) => {
    //setName(debtorName);
    if (debtorName === '') {
        alert("Please Enter Something!");
    } else {
      let full = debtorName;
    newPerson(full, totalOwed); 
    //setDebtors(people);
    storeData();
    }
  };
  const handleGet = () => {
    peopleOwed = people[0];
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
  }

  

  const readList = 'PLACEHOLDER FOR DISPLAYING DEBTOR LIST';
  
    return (
        <ScrollView style={styles.scroll}>
              <View style={styles.container}>
                <Button title="Back to Home" onPress={() => navigation.navigate('Home')}/>
                <Text>Enter debtor's name:</Text>
                <TextInput 
                style={styles.input}
                placeholder={"e.g. John Doe"}
                onChangeText={(text) => setNameHolder(text)}
                />
                <Button title="Make new Debtor" onPress={()=>handleSubmit(nameHolder)}/>
                <Button title="Who Owes Me Money" onPress={()=>handleGet()}/>
                <Text style={styles.label}>These are my debtors and what they owe:</Text>
                <Text style={styles.label}>{readList}</Text>
              </View>
         </ScrollView>
    )
};


function newPerson(thing, number){
  for(let i = 0; i<people.length; i++){
    if(thing == people[i].fullname){
      return;
    }
  }
    var debtor = new newerPerson(thing, number);
    people.push(debtor);
    console.log(people);
};

  /* function getDebtors(){
    for(let i = 0;i< people.length; i++){
      // peopleOwed = localStorage.getItem(people[i]);
    }
  }; */

  async function getDebtor(){
    try {
      const value = await AsyncStorage.getItem(token);
      if (value !== null) {
        // We have data!!
        people = (JSON.parse(value));
      }
    } catch (error) {
      // Error retrieving data
      console.log("failure in getting debtors");
    }
  }; 

  const styles = StyleSheet.create({
    scroll: { flex: 1, backgroundColor: '#fff' },
    container: { padding: 20, alignItems: 'center' },
    image: { width: 300, height: 400, marginVertical: 20 },
    label: { marginTop: 10, fontSize: 16, fontWeight: 'bold' },
    result: { marginTop: 10, fontSize: 16, textAlign: 'left', width: '100%' },
  });