import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'tokenator';

export default function Debtor({ navigation }) {
  const [debtors, setDebtors] = useState([]);
  const [selectedDebtor, setSelectedDebtor] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');

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

  const handlePayment = () => {
    if (!paymentAmount || isNaN(paymentAmount)) {
      alert('Please enter a valid payment amount.');
      return;
    }

    const updatedDebtors = debtors.map((debtor) => {
      if (debtor.name === selectedDebtor.name) {
        const payment = {
          description: 'Payment',
          price: -Math.abs(parseFloat(paymentAmount)),
          date: new Date().toLocaleDateString(),
        };
        return {
          ...debtor,
          owed: Math.max(0, debtor.owed - Math.abs(parseFloat(paymentAmount))),
          items: [...debtor.items, payment],
        };
      }
      return debtor;
    });

    setDebtors(updatedDebtors);
    saveDebtors(updatedDebtors);
    setPaymentAmount('');
    alert('Payment recorded successfully.');
  };

  const clearHistory = () => {
    const updatedDebtors = debtors.map((debtor) => {
      if (debtor.name === selectedDebtor.name) {
        return { ...debtor, items: [], owed: 0 };
      }
      return debtor;
    });

    setDebtors(updatedDebtors);
    saveDebtors(updatedDebtors);
    setSelectedDebtor({ ...selectedDebtor, items: [], owed: 0 });
    alert('History cleared successfully.');
  };

  const deleteDebtor = () => {
    const updatedDebtors = debtors.filter((debtor) => debtor.name !== selectedDebtor.name);
    setDebtors(updatedDebtors);
    saveDebtors(updatedDebtors);
    setSelectedDebtor(null);
    alert('Debtor deleted successfully.');
  };

  const renderDebtor = ({ item }) => (
    <TouchableOpacity
      style={styles.debtorRow}
      onPress={() => setSelectedDebtor(item)}
    >
      <Text style={styles.debtorName}>{item.name}</Text>
      <Text style={styles.debtorAmount}>${item.owed.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <Text style={styles.label}>Debtors List:</Text>
      <FlatList
        data={debtors}
        renderItem={renderDebtor}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={
          selectedDebtor && (
            <View style={styles.selectedDebtorContainer}>
              <Text style={styles.sectionTitle}>Debtor Details</Text>
              <Text style={styles.debtorName}>Name: {selectedDebtor.name}</Text>
              <Text style={styles.debtorAmount}>Total Owed: ${selectedDebtor.owed.toFixed(2)}</Text>

              <Text style={styles.sectionTitle}>Items:</Text>
              {selectedDebtor.items.length > 0 ? (
                selectedDebtor.items.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <Text style={styles.itemDescription}>{item.description}</Text>
                    <Text style={styles.itemPrice}>
                      ${item.price.toFixed(2)} ({item.date})
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noItemsText}>No items found.</Text>
              )}

              <Text style={styles.sectionTitle}>Record Payment:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter payment amount"
                keyboardType="numeric"
                value={paymentAmount}
                onChangeText={setPaymentAmount}
              />
              <TouchableOpacity style={styles.button} onPress={handlePayment}>
                <Text style={styles.buttonText}>Record Payment</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#FF6347' }]}
                onPress={clearHistory}
              >
                <Text style={styles.buttonText}>Clear History</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#FF0000' }]}
                onPress={deleteDebtor}
              >
                <Text style={styles.buttonText}>Delete Debtor</Text>
              </TouchableOpacity>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { marginTop: 10, fontSize: 16, fontWeight: 'bold' },
  debtorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  debtorName: { fontSize: 16, fontWeight: '500' },
  debtorAmount: { fontSize: 16, fontWeight: '500' },
  selectedDebtorContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemDescription: { fontSize: 16 },
  itemPrice: { fontSize: 16, fontWeight: '500' },
  noItemsText: { fontSize: 16, fontStyle: 'italic', color: '#888' },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});