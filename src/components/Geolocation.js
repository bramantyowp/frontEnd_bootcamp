import { View, Text, Alert, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react';
import {HERE_API_KEY} from '@env';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

export default function GeoLoc() {
    const getAddressFromCoordinates = async ({ latitude, longitude }) => {
        try {
            const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?apiKey=${HERE_API_KEY}&
                limit=1&at=${latitude},${longitude}`;

            const res = await axios(url);
            const resJson = res.data;
            // the response had a deeply nested structure :/
            if (resJson?.items.length) {
                console.log()
                const {address} = resJson.items[0];
                return `${address.street}, ${address.houseNumber}`;
            }
            return null;
        } catch (e) {
            console.log(e.response)
            // console.log('Error in getAddressFromCoordinates', e)
        }
    }

    const getCurrentPosition = () => {
        Geolocation.getCurrentPosition(
            (pos) => {
                const address = getAddressFromCoordinates(pos.coords);
                setPosition(address);
            },
            (error) => Alert.alert('GetCurrentPosition Error', JSON.stringify(error)),
            { enableHighAccuracy: true }
        );
    };

    const [position, setPosition] = useState(null);

    useEffect(() => getCurrentPosition(), []);

    return (
        <View>
            <Text style={styles.title}>{position}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontWeight: '500',
        color: 'white',
    },
});
