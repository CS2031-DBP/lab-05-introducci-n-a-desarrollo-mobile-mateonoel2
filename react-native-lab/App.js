import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useEffect, useState } from 'react';

export default function App() {
  const [data, setData] = useState();
  const [facts, setFacts] = useState({});
  const [number, setNumber] = useState(0);

  useEffect(() => {
    fetch('https://cat-fact.herokuapp.com/facts')
      .then((response) => response.json())
      .then((json) => {
        setFacts(json);
        setData(json[0].text);
      })
      .catch((error) => console.error(error))
  }, []);

  const onPressLearnMore = () => {
    setNumber(number + 1);
    if (facts[number] === undefined) {
      setData(facts[0].text);
      setNumber(1);
    } else {
      setData(facts[number].text);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: 'bold' }}>Cat Facts</Text>
      <View style={{ margin: 20 }}></View>
      <Text>{data}</Text>
      <Button
        onPress={onPressLearnMore}
        title="Change fact"
        color="blue"
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
