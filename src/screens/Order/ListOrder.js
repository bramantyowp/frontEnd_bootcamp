/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useState, useEffect, useCallback } from 'react';
import moment from "moment";
import {
    FlatList,
    SafeAreaView,
    useColorScheme,
} from 'react-native';

import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '@reducers/user';
import { getOrder, selectOrderList } from '@reducers/order/list';
import { useFocusEffect } from '@react-navigation/native';
import OrderList from '@components/OrderList';


const COLORS = {
    primary: '#A43333',
    secondary: '#5CB85F',
    darker: '#121212',
    lighter: '#ffffff'
}

function List() {
    const isDarkMode = useColorScheme() === 'dark';
    const dispatch = useDispatch()
    const user = useSelector(selectUser);
    const order = useSelector(selectOrderList);

    const fetchOrder = async () => {
        console.log('fetch')
        const page = 1;
        // if (!order.data.length || page > order.data?.page && order.status === 'idle') {
        dispatch(getOrder({page, token: user.token}))
        // }
    }

    useFocusEffect(
        useCallback(() => {
            fetchOrder();
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
                data={order.data?.data}
                renderItem={({ item, index }) =>
                    <OrderList
                        key={item.id}
                        overdue={moment(item.overdue_time)}
                        carName={item.cars.name}
                        status={item.status}
                        date={moment(item.createdDt).format("DD MMMM YYYY")}
                        price={item.total}
                    />
                }
                keyExtractor={item => item.id}
            />
        </SafeAreaView>
    );
}

export default List;
