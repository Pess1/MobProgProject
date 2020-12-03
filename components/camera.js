import React, { useEffect, useState, useRef } from 'react';
import { View, Text } from 'react-native';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import{ Icon } from'react-native-elements';

export default function CameraPage({route, navigation}) {
    const [hasCameraPermission, setPermission] = useState(null);
    const [hasAudioPermission, setAudioPermission] = useState(null);
    const [hasMediaPermission, setMediaPermission] = useState(null);

    const camera = useRef(null);

    const [recording, setRecording] = useState(false);
    const [buttonColor, setButtonColor] = useState('blue');
    const [iconName, setIconName] = useState('play-arrow');

    useEffect(() => {
        askCameraPermissions();
        askAudioPermissions();
        askMediaPermissions();
    }, [])

    const askCameraPermissions = async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setPermission( status == 'granted' );
    }

    const askAudioPermissions = async () => {
        const { status } = await Audio.requestPermissionsAsync();
        setAudioPermission( status == 'granted');
    }

    const askMediaPermissions = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        setMediaPermission( status == 'granted');
    }

    const saveVideo = async (vid) => {
        console.log(vid.uri)
        let isSaved = await MediaLibrary.createAssetAsync(vid.uri);
        if (isSaved) {
            console.log('saved');
        }
    }

    const togleRecording = () => {
        if (recording) {
            stopRecording();
        } else {
            startRecording();
        }
    }

    const stopRecording = () => {
        camera.current.stopRecording();
        setRecording(false);
        setButtonColor('blue');
        setIconName('play-arrow');
    }

    const startRecording = async () => {
        setRecording(true);
        setButtonColor('red');
        setIconName('stop');
        const vid = await camera.current.recordAsync()
        console.log("startRecording Resolved")
        console.log(vid)
        saveVideo(vid)
    }
    
    return (
        <View style={{flex: 1}}>
            { hasMediaPermission, hasCameraPermission, hasAudioPermission ?
                (
                    <View style={{flex: 1}}>
                        <Camera style={{ flex: 1 }} ref={camera} />
                        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                            <Icon type='material' name={iconName} onPress={togleRecording} raised color={buttonColor} />
                        </View>
                    </View>
                ) : (
                    <Text>No access to all required permissions! (Camera, Audio, Media)</Text>
                )
            }
        </View>
    ) 
}

