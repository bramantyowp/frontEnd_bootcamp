import { View, Text, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react'
import Button from '../components/Button';
import { useSelector, useDispatch } from 'react-redux';
import { getProfile, selectUser, resetState as logout } from '../redux/reducers/user';

export default function Akun() {
    const navigation = useNavigation();
    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    useEffect(() => {
        if(!user.data && user.token){
            dispatch(getProfile(user.token));
        }
    }, [user]);

    return (
        <View>
            {
                !user.isLogin ?
                    <View>
                        <Image source={require('../assets/images/akun_bg.png')} />
                        <Text>Upss kamu belum memiliki akun. Mulai buat akun agar transaksi di TMMIN Car Rental lebih mudah</Text>
                        <Button
                            onPress={() => navigation.navigate('SignUp')}
                            title={'Register'}
                            color={'#5CB85F'}
                        />
                    </View> :
                    <View>
                        <Image height={50} width={50} source={{ uri: user.data?.avatar ? user.data?.avatar : "https://i.pravatar.cc/100" }} />
                        <Text>Halo, {user.data?.fullname}</Text>
                        <Button
                            onPress={() => dispatch(logout())}
                            title={'Logout'}
                            color={'#A43333'}
                        />
                    </View>
            }
        </View>
    )
}
