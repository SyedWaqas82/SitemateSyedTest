import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Text,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import {useForm} from 'react-hook-form';
import axios from 'axios';

const HomeScreen = () => {
  const {control, handleSubmit, reset} = useForm({
    // defaultValues: {artist: 'Coldplay', title: 'Adventure of a Lifetime'},
  });
  const [lyrics, setLyrics] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  const onSearchPressed = data => {
    setLyrics('');

    const lyricsFromHoistory = searchHistory.find(
      s => s.artist === data.artist && s.title === data.title,
    )?.lyrics;

    if (lyricsFromHoistory) {
      setLyrics(lyricsFromHoistory);
      return;
    }

    setIsLoading(true);

    axios
      .get(`https://api.lyrics.ovh/v1/${data.artist}/${data.title}`)
      .then(resp => {
        setLyrics(resp.data.lyrics);
        setSearchHistory([
          ...searchHistory,
          {artist: data.artist, title: data.title, lyrics: resp.data.lyrics},
        ]);
      })
      .catch(error => {
        if (error.response?.status === 404) {
          Alert.alert('no lyrics found');
        } else {
          Alert.alert(error.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onResetPressed = () => {
    reset();
    setLyrics('');
  };

  return (
    <View style={styles.container}>
      <CustomInput
        name="artist"
        placeholder="Artist"
        control={control}
        rules={{required: 'Artist name is required'}}
      />

      <CustomInput
        name="title"
        placeholder="Title"
        control={control}
        rules={{required: 'Title is required'}}
      />

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.buttonsContainer}>
          <CustomButton onPress={handleSubmit(onSearchPressed)} text="Search" />
          <CustomButton onPress={onResetPressed} text="Reset" />
        </View>
      )}

      <ScrollView style={styles.scrollview}>
        <Text>{lyrics}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  buttonsContainer: {
    alignSelf: 'stretch',
  },
  scrollview: {
    alignSelf: 'stretch',
  },
});

export default HomeScreen;
