import React, { useEffect, useState, useRef } from 'react';
import {View, Text} from 'react-native';
import * as Permissions from 'expo-permissions';
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

    const [video, setVideo] = useState({});

    useEffect(() => {
        askPermissions();
    }, [])

    const askPermissions = async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setPermission( status == 'granted' );
        const { audioStatus } = await Audio.requestPermissionsAsync();
        setAudioPermission( audioStatus == 'granted');
        const { mediaStatus } = await MediaLibrary.requestPermissionsAsync();
        setMediaPermission( mediaStatus == 'granted');
    }

    const record = async () => {
        if (recording == false) {
            setRecording(true);
            setButtonColor('red');
            setIconName('stop');
            setVideo(await camera.current.recordAsync());
        } else {
            console.log("pebis")
            camera.current.stopRecording();
            setRecording(false);
            setButtonColor('blue');
            setIconName('play-arrow');
            saveVideo(video);
        }
    }


    const saveVideo = async (vid) => {
        console.log(vid)
        let isSaved = await MediaLibrary.createAssetAsync(vid.uri);
        if (isSaved) {
            console.log('saved');
        }
    }

    return (
        <View style={{flex: 1}}>
            { hasCameraPermission ?
                (
                    <View style={{flex: 1}}>
                        <Camera style={{ flex: 1 }} ref={camera} />
                        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                            <Icon type='material' name={iconName} onPress={record} raised color={buttonColor} />
                        </View>
                    </View>
                ) : (
                    <Text>No access to camera</Text>
                )
            }
        </View>
    ) 
}

