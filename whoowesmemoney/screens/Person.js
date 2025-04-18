<<<<<<< Updated upstream
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
=======
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

let people = [];
const token = "tokenator";
const TAX_KEY = "taxPercentage";
const TIP_KEY = "tipPercentage";

function DebtorPerson(name, amount, items = []) {
  this.name = name;
  this.owed = amount;
  this.items = items;
}

export default function Person({ navigation, route }) {
  const [name, setName] = useState('');
  const [totalOwed, setTotalOwed] = useState(0);
  const [assignedItems, setAssignedItems] = useState([]);
  const [taxPercentage, setTaxPercentage] = useState(0); // Tax as a percentage
  const [tipPercentage, setTipPercentage] = useState(0); // Tip as a percentage
  const [selectedDebtor, setSelectedDebtor] = useState('');
  const [isNewDebtor, setIsNewDebtor] = useState(true);

  useEffect(() => {
    // Load debtor data and saved tax/tip percentages
    getDebtor();
    loadTaxAndTip();

    // Handle data passed from Home.js
    if (route.params?.selectedItems) {
      setAssignedItems(route.params.selectedItems);
    }

    if (route.params?.totalAmount) {
      setTotalOwed(parseFloat(route.params.totalAmount) || 0); // Ensure totalAmount is a valid number
    }
  }, [route.params]);

  const createDebtor = () => {
    const debtorName = isNewDebtor ? name.trim() : selectedDebtor;

    if (!debtorName) {
      alert('Please enter or select a debtor name');
      return;
    }

    // Calculate tax and tip amounts
    const taxAmount = (parseFloat(taxPercentage || 0) / 100) * totalOwed;
    const tipAmount = (parseFloat(tipPercentage || 0) / 100) * totalOwed;
    const totalWithTaxAndTip = parseFloat(totalOwed) + taxAmount + tipAmount;

    const existingPersonIndex = people.findIndex(p => p.name === debtorName);

    if (existingPersonIndex !== -1) {
      // Update existing person
      const updatedPerson = {
        ...people[existingPersonIndex],
        owed: parseFloat(people[existingPersonIndex].owed) + totalWithTaxAndTip,
        items: [...people[existingPersonIndex].items, ...assignedItems]
      };

      people[existingPersonIndex] = updatedPerson;
      storeData();
      alert(`Updated ${debtorName}'s debt to $${updatedPerson.owed.toFixed(2)}`);
    } else {
      // Create new person
      const newDebtor = new DebtorPerson(debtorName, totalWithTaxAndTip, assignedItems);
      people.push(newDebtor);
      storeData();
      alert(`Added ${debtorName} with debt $${totalWithTaxAndTip.toFixed(2)}`);
    }

    console.log('Current people:', people);

    // Save the current tax and tip percentages
    saveTaxAndTip();

    setName('');
    setTotalOwed(0);
    setAssignedItems([]);
    navigation.goBack(); // Navigate back to the previous page
  };

  const getDebtor = async () => {
    try {
      const value = await AsyncStorage.getItem(token);
      if (value !== null) {
        people = JSON.parse(value);
        console.log('Loaded people:', people);
      }
    } catch (error) {
      console.log("Error retrieving debtors:", error);
    }
  };

  const storeData = async () => {
    try {
      await AsyncStorage.setItem(token, JSON.stringify(people));
      console.log("Debtor data saved successfully!");
    } catch (error) {
      console.log("Error saving debtor data:", error);
    }
  };

  const saveTaxAndTip = async () => {
    try {
      await AsyncStorage.setItem(TAX_KEY, taxPercentage.toString());
      await AsyncStorage.setItem(TIP_KEY, tipPercentage.toString());
      console.log("Tax and Tip percentages saved successfully!");
    } catch (error) {
      console.log("Error saving tax and tip percentages:", error);
    }
  };

  const loadTaxAndTip = async () => {
    try {
      const savedTax = await AsyncStorage.getItem(TAX_KEY);
      const savedTip = await AsyncStorage.getItem(TIP_KEY);

      if (savedTax !== null) {
        setTaxPercentage(parseFloat(savedTax));
      }

      if (savedTip !== null) {
        setTipPercentage(parseFloat(savedTip));
      }

      console.log("Loaded Tax and Tip percentages:", { savedTax, savedTip });
    } catch (error) {
      console.log("Error loading tax and tip percentages:", error);
    }
  };

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>

        <Text style={styles.sectionTitle}>Debtor Information</Text>

        <Text style={styles.label}>Select an existing debtor or enter a new one:</Text>
        <Picker
          selectedValue={selectedDebtor}
          onValueChange={(itemValue) => {
            setSelectedDebtor(itemValue);
            setIsNewDebtor(itemValue === ''); // If no debtor is selected, enable new debtor input
          }}
          style={styles.picker}
        >
          <Picker.Item label="-- Add New Debtor --" value="" />
          {people.map((person, index) => (
            <Picker.Item key={index} label={person.name} value={person.name} />
          ))}
        </Picker>

        {isNewDebtor && (
          <TextInput
            style={styles.input}
            value={name}
            placeholder="Enter new debtor name"
            onChangeText={(text) => setName(text)}
          />
        )}

        {assignedItems.length > 0 && (
          <View style={styles.itemsContainer}>
            <Text style={styles.sectionTitle}>Assigned Items</Text>

            {assignedItems.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemPrice}>
                  ${item.price ? parseFloat(item.price).toFixed(2) : '0.00'} {/* Validate price */}
                </Text>
              </View>
            ))}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>
                ${totalOwed ? parseFloat(totalOwed).toFixed(2) : '0.00'} {/* Validate totalOwed */}
              </Text>
            </View>

            <Text style={styles.label}>Add Tax (%):</Text>
            <TextInput
              style={styles.input}
              value={taxPercentage.toString()}
              placeholder="Enter tax percentage"
              keyboardType="numeric"
              onChangeText={(text) => {
                setTaxPercentage(parseFloat(text) || 0);
                saveTaxAndTip(); // Save tax percentage
              }}
            />

            <Text style={styles.label}>Add Tip (%):</Text>
            <TextInput
              style={styles.input}
              value={tipPercentage.toString()}
              placeholder="Enter tip percentage"
              keyboardType="numeric"
              onChangeText={(text) => {
                setTipPercentage(parseFloat(text) || 0);
                saveTaxAndTip(); // Save tip percentage
              }}
            />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total with Tax & Tip:</Text>
              <Text style={styles.totalAmount}>
                ${(parseFloat(totalOwed) + (parseFloat(taxPercentage || 0) / 100) * totalOwed + (parseFloat(tipPercentage || 0) / 100) * totalOwed).toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={createDebtor}
          >
            <Text style={styles.buttonText}>
              {people.some(p => p.name === name || p.name === selectedDebtor) ? 'Update Debtor' : 'Create Debtor'}
            </Text>
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
  picker: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
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
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  }
});
>>>>>>> Stashed changes
