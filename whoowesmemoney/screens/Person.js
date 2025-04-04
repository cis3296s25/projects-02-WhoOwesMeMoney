import React, { useState, useRef, useCallBack } from 'react';
import { View, Button, Image, Text, ScrollView, StyleSheet, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

let full = "First Last";
let totalOwed = 0.00;
// var listOwed = [];
// var amountOwed = [];
var people = [];
function newerPerson(word, number){
  this.name = word;
  this.owed = number;
}


export default function Person({ navigation }){
  const [name, setName] = useState('John Doe');
  const inputRef = useRef();
  const [person, setPerson] = useState([{}]);
  const onPressButton = () =>{
    newPerson(name, totalOwed); 
  };
  const handleSubmit = () => {
    let textInputValue = inputRef.text;
  };
  
    return (
        <ScrollView style={styles.scroll}>
              <View style={styles.container}>
              <Button title="Back to Home" onPress={() => navigation.navigate('Home')}/>
                <Text>Enter debtor's name:</Text>
                <TextInput 
                style={styles.input}
                value={name}
                placeholder={"e.g. John Doe"}
                onChangeText={(text) => setName(text)}/>
                <Button title="Make new Debtor" onPress={onPressButton}/>
                <Button title="What Is Owed" onPress={personCheck(full)}/>
                <Text style={styles.label}>This person owes me in total:</Text>
                <Text style={styles.label}>{totalOwed}</Text>
              </View>
         </ScrollView>
    )
};


function newPerson(thing, number){
  for(let i = 0; i<people.length; i++){
    if(thing == people[i].name){
      return;
    }
  }
    var debtor = new newerPerson(thing, number);
    people.push(debtor);
    console.log(people);
};
  function personCheck(full){
    for(let i = 0;i < people.length; i++){
      if(full == people[i].fullName){
        totalOwed = people[i].owed;
      }
    }
  }

  const styles = StyleSheet.create({
    scroll: { flex: 1, backgroundColor: '#fff' },
    container: { padding: 20, alignItems: 'center' },
    image: { width: 300, height: 400, marginVertical: 20 },
    label: { marginTop: 10, fontSize: 16, fontWeight: 'bold' },
    result: { marginTop: 10, fontSize: 16, textAlign: 'left', width: '100%' },
  });