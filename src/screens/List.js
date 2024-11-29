/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useCallback } from 'react';
import {
    FlatList,
    SafeAreaView,
    useColorScheme,
} from 'react-native';

import CarList from '../components/CarList';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import { useDispatch, useSelector } from 'react-redux';
import { getCars, selectCars } from '../redux/reducers/cars';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const COLORS = {
    primary: '#A43333',
    secondary: '#5CB85F',
    darker: '#121212',
    lighter: '#ffffff'
}

function List() {
    const isDarkMode = useColorScheme() === 'dark';
    const dispatch = useDispatch()
    const cars = useSelector(selectCars);
    const navigation = useNavigation();

    const fetchCars = async () => {
        const page = 1;
        if (!cars.data.length || page > cars.data?.page && cars.status === 'idle') {
            dispatch(getCars(page))
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchCars();
        }, [])
    );

    const backgroundStyle = {
        // overflow: 'visible',
        backgroundColor: isDarkMode ? COLORS.darker : COLORS.lighter,
    };

    return (
        <SafeAreaView style={backgroundStyle}>
            <FocusAwareStatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={COLORS.lighter}
            />
            {/* end banner */}
            <FlatList
                data={cars.data.data}
                renderItem={({ item, index }) =>
                    <CarList
                        key={item.id}
                        image={{ uri: item.img }}
                        carName={item.name}
                        passengers={item.seat}
                        baggage={item.baggage}
                        price={item.price}
                        onPress={() => navigation.navigate('Detail', { id: item.id })}
                        onEndReached={fetchCars}
                        onEndReachedThreshold={0.8}
                    />
                }
                keyExtractor={item => item.id}
            />
        </SafeAreaView>
    );
}

export default List;
