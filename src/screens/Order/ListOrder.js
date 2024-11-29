/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import {
    FlatList,
    SafeAreaView,
    useColorScheme,
} from 'react-native';

import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '@reducers/user';
import { getOrder, selectOrderList } from '@reducers/order/list';
import { cancelOrder } from '@reducers/order';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import OrderList from '@components/OrderList';
import { selectOrder, setStateByName } from '../../redux/reducers/order';

const COLORS = {
    primary: '#A43333',
    secondary: '#5CB85F',
    darker: '#121212',
    lighter: '#ffffff',
};

function List() {
    const isDarkMode = useColorScheme() === 'dark';
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const orders = useSelector(selectOrderList);
    const order = useSelector(selectOrder);
    const navigation = useNavigation();

    const fetchOrder = async () => {
        const page = 1;
        // if (!order.data.length || page > order.data?.page && order.status === 'idle') {
        dispatch(getOrder({page, token: user.token}));
        // }
    };

    const onCountdownEnd = async(id) => {
        dispatch(cancelOrder(id))
    };

    const handleNavigate = (status, id, carId) => {
        if(status !== 'pending') {
            return navigation.navigate('OrderDetail', {id});
        }

        return navigation.navigate('Order', {orderId: id, carId: carId});
    };

    useEffect(() => {
        if(order.status !== 'pending'){
            setTimeout(() => {
               dispatch(setStateByName({
                    name:'status',
                    value:'pending'
               }));
            }, 1000)
        }
    }, [order])

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
                data={orders.data?.data}
                renderItem={({ item, index }) =>
                    <OrderList
                        key={item.id}
                        overdue={moment(item.overdue_time)}
                        carName={item.cars.name}
                        status={item.status}
                        onPress={() => handleNavigate(item.status, item.id, item.cars.id)}
                        onCountdownEnd={() => onCountdownEnd(item.id)}
                        date={moment(item.createdDt).format('DD MMMM YYYY')}
                        price={item.total}
                    />
                }
                keyExtractor={item => item.id}
            />
        </SafeAreaView>
    );
}

export default List;
