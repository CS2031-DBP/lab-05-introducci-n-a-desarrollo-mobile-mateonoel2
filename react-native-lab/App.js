import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [data, setData] = useState('');
  const [facts, setFacts] = useState({});
  const [number, setNumber] = useState(0);
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetch('https://cat-fact.herokuapp.com/facts')
      .then((response) => response.json())
      .then((json) => {
        setFacts(json);
        setData(json[0].text);
      })
      .catch((error) => console.error(error));

    // Solicitar permisos para acceder a la cámara
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Permiso denegado para acceder a la cámara');
      }
    })();
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

  const openCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled) {
      // Subir la imagen a Cloudinary o cualquier otro servicio en la nube
      const formData = new FormData();
      formData.append('file', {
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });
    
      const cloudinaryCloudName = 'dalsog2hb';
      const cloudinaryUploadPreset = 'alphtdg5';
      const cloudinaryApiKey = '778342524695887';

      const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload?upload_preset=${cloudinaryUploadPreset}&api_key=${cloudinaryApiKey}`;

      fetch(cloudinaryUploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => response.json())
        .then(responseData => {
          console.log('Imagen subida con éxito a Cloudinary:', responseData);
        })
        .catch(error => {
          console.error('Error al subir la imagen a Cloudinary:', error);
        });

      setImage(result.assets[0].uri);
    }
  };



  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: 'bold' }}>Cat Facts</Text>
      <View style={{ margin: 20 }}>
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>
      <Text>{data}</Text>
      <Button onPress={onPressLearnMore} title="Change fact" color="blue" />
      <Button onPress={openCamera} title="Open Camera" color="green" />
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
