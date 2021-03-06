import * as ExpoPixi from 'expo-pixi';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, Text } from 'react-native';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import{ Icon } from'react-native-elements';

export default function sketchPage ({navigation}) {
  const [isPaused, setIsPaused] = useState(false);
  const [playIcon, setPlayIcon] = useState('play-arrow');
  const [speedIconColor, setSpeedIconColor] = useState('grey');
  const [video, setVideo] = useState({uri: './assets/placeholder.mp4', name: 'liftvideo', rate: 1});
  const [penColor, setPenColor] = useState(0xff55ff);

  const opacity = React.useMemo(() => new Animated.Value(0), []);
  const [hasCameraRollPermission, setCameraRollPermission] = useState(null);

  //UseRef
  const pixiSketch = useRef(null)
  
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

  //Change pen color to magenta
  const magenta = () => {
    setPenColor(0xff55ff)
  }

  //Change pen color blue
  const blue = () => {
    setPenColor(0x55a2ff)
  }

  //Change pen color green
  const green = () => {
    setPenColor(0x55ff66)
  }
  
  //How to get the video as a background was taken from this source https://github.com/expo/examples/blob/master/with-video-background/App.js
  return (
    <View style={{flex: 1}}>
      { hasCameraRollPermission ?
        (
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
                strokeColor={penColor}
                strokeWidth={8}
                strokeAlpha={1}
                ref={pixiSketch}
              />
              <View style={styles.icon}>
                <Icon type='material' name={playIcon} color='red' raised onPress={play}/>
                <Icon type='material' name='slow-motion-video' color={speedIconColor} raised onPress={videoSpeed}/>
                <Icon type='material' name='video-library' color='blue' raised onPress={selectVideo}/>
                <Icon type='material' name='videocam' color='black' raised onPress={() => navigation.navigate('Camera Page')}/>
                <Icon type='material' name='undo' color='red' raised onPress={() => pixiSketch.current.undo()}/>
              </View>
              <View style={styles.icon}>
                <Icon type='material' name='brush' color='#ff55ff' raised onPress={magenta}/>
                <Icon type='material' name='brush' color='#55a2ff' raised onPress={blue}/>
                <Icon type='material' name='brush' color='#55ff66' raised onPress={green}/>
              </View>
            </View>
          </View>
        ) : (
          <Text>No access to Camera Roll = MY APP NO WORK!</Text>
        )
      }
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