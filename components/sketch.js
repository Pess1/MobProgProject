import Expo from 'expo';
import * as ExpoPixi from 'expo-pixi';
import React, { Component, useEffect, useState } from 'react';
import { Image, Button, Platform, AppState, StyleSheet, Text, View, Animated } from 'react-native';
import App from '../App';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import{ Icon } from'react-native-elements';
 
const isAndroid = Platform.OS === 'android';
function uuidv4() {
  //https://stackoverflow.com/a/2117523/4047926
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
//http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4
export default function sketchPage ({navigation}) {
  const [isPaused, setIsPaused] = useState(false);
  const [playIcon, setPlayIcon] = useState('play-arrow');
  const [speedIconColor, setSpeedIconColor] = useState('grey');
  const [video, setVideo] = useState({uri: './assets/placeholder.mp4', name: 'liftvideo', rate: 1});

  const opacity = React.useMemo(() => new Animated.Value(0), []);
  const [cameraRollPermission, setCameraRollPermission] = useState(null);
  
  //Camera Roll Permissions to access user videos
  const askCameraRollPermission = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    setCameraRollPermission( status == 'granted' );
  }

  useEffect(() => {
    askCameraRollPermission();
  })

  //Play / pause function. Also, switches icon pics
  const play = () => {
    if (isPaused == true) {
      setIsPaused(false);
      setPlayIcon('play-arrow');
    } else {
      setIsPaused(true);
      setPlayIcon('pause');
    }
  }

  //Function to access user video library. Shows only videos.
  const selectVideo = async () => {
    let videos = await (ImagePicker.launchImageLibraryAsync({mediaTypes: ImagePicker.MediaTypeOptions.Videos}));
    if (!videos.cancelled) {
      setVideo({...video, uri: videos.uri});
    }
  }

  //Switches between 1x and 0.5x speed for video.
  const videoSpeed = () => {
    if (video.rate == 1.0) {
      setVideo({...video, rate: 0.5})
      setSpeedIconColor('lightblue')
    } else {
      setVideo({...video, rate: 1.0})
      setSpeedIconColor('grey')
    }
    
  }
  /*state = {
    image: null,
    appState: AppState.currentState,
  };

  handleAppStateChangeAsync = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      if (isAndroid && this.sketch) {
        this.setState({ appState: nextAppState, id: uuidv4(), lines: this.sketch.lines });
        return;
      }
    }
    this.setState({ appState: nextAppState });
  };

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChangeAsync);
  }

  UNSAFE_componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChangeAsync);
  }

  onReady = () => {
    console.log('ready!');
  }; */


  //How to get the video as a background was taken from this source https://github.com/expo/examples/blob/master/with-video-background/App.js
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <Animated.View
          style={[
            styles.backgroundViewWrapper,
            { opacity: opacity }
          ]}
        >
          <Video
            source={{uri: video.uri}}
            rate={video.rate}
            isMuted={true}
            resizeMode="cover"
            shouldPlay={isPaused}
            isLooping
            style={{ flex: 1}}
            onLoad={() => {
              // https://facebook.github.io/react-native/docs/animated#timing
              Animated.timing(opacity, {
                toValue: 1,
                useNativeDriver: true,
              }).start();
            }}
          />
        </Animated.View>
      </View>
      <View style={styles.overlay}>
        <ExpoPixi.Sketch
          style={styles.sketch}
          strokeColor={0xff55ff}
          strokeWidth={8}
          strokeAlpha={1}
        />
        <View style={styles.icon}>
          <Icon type='material' name={playIcon} color='red' raised onPress={play}/>
          <Icon type='material' name='slow-motion-video' color={speedIconColor} raised onPress={videoSpeed}/>
          <Icon type='material' name='video-library' color='blue' raised onPress={selectVideo}/>
          <Icon type='material' name='videocam' color='black' raised onPress={() => navigation.navigate('CameraPage')}/>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center'
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black'
  },
  backgroundViewWrapper: {
    ...StyleSheet.absoluteFillObject
  },

  sketch: {
    height: '80%',
    width: '100%',
    backgroundColor: 'transparent',
  },
  sketchContainer: {
    height: '90%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  icon: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});