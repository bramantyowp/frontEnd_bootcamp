/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useCallback } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import Button from '@components/Button';
import Icon from 'react-native-vector-icons/Feather';
import CarList from '@components/CarList';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '@reducers/user';
import { selectCars, getCars } from '@reducers/cars';
import { COLORS } from '@constant';
import GlobalModal from '@components/Modal/GlobalModal';
import GeoLoc from '../components/Geolocation';

const ButtonIcon = ({ icon, title }) => (
  <Button>
    <View style={styles.iconWrapper}>
      <Icon name={icon} size={25} color="#fff" />
    </View>
    <Text style={styles.iconText}>{title}</Text>
  </Button>
)

function Home() {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useDispatch()
  const user = useSelector(selectUser);
  const cars = useSelector(selectCars);

  const fetchCars = async () => {
    const page = 1;
    if(page > cars.data?.page && cars.status === 'idle'){
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
      <GlobalModal />
      <FocusAwareStatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={COLORS.primary}
      />
      {/* end banner */}
      <FlatList
        data={cars.data?.data}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.headerContainer}>
                <View>
                  <Text style={styles.headerText}>Hi, {user.data ? user.data?.fullname : 'Guest'}</Text>
                  <GeoLoc />
                </View>
                <View >
                  <Image style={styles.imageRounded} source={{ uri: user.data ? user.data?.avatar : "https://i.pravatar.cc/100" }} width={50} height={50} />
                </View>
              </View>
              {/* banner */}
              <View style={{
                ...styles.headerContainer,
                ...styles.bannerContainer
              }}>
                <View style={styles.bannerDesc}>
                  <Text style={styles.bannerText}>Sewa Mobil Berkualitas di kawasanmu</Text>
                  <Button
                    color={COLORS.secondary}
                    title='Sewa Mobil'
                  />
                </View>
                <View style={styles.bannerImage}>
                  <Image source={require('../assets/images/img_car.png')} width={50} height={50} />
                </View>
              </View>
            </View>
            <View style={styles.iconContainer}>
              <ButtonIcon icon="truck" title="Sewa Mobil" />
              <ButtonIcon icon="box" title="Oleh-Oleh" />
              <ButtonIcon icon="key" title="Penginapan" />
              <ButtonIcon icon="camera" title="Wisata" />
            </View>
          </>
        }
        renderItem={({ item, index }) =>
          <CarList
            key={item.id}
            image={{ uri: item.img }}
            carName={item.name}
            passengers={item.seat}
            baggage={item.baggage}
            price={item.price}
            onEndReached={fetchCars}
            onEndReachedThreshold={0.8}
            onPress={() => navigation.navigate('Detail', {id: item.id})}
          />
        }
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    height: 130,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between', // posisi horizontal
    alignItems: 'center', // posisi
    padding: 10
  },
  imageRounded: {
    borderRadius: 40,
  },
  headerText: {
    color: COLORS.lighter,
    fontWeight: 700,
    fontSize: 12
  },
  headerTextLocation: {
    color: COLORS.lighter,
    fontWeight: 700,
    fontSize: 14
  },
  bannerContainer: {
    borderRadius: 4,
    padding: 0,
    backgroundColor: '#AF392F',
    marginHorizontal: 10,
    flexWrap: 'wrap',
    marginBottom: -200
  },
  bannerText: {
    fontSize: 16,
    marginBottom: 10,
    color: COLORS.lighter,
  },
  bannerDesc: {
    paddingHorizontal: 10,
    width: '40%'
  },
  iconContainer: {
    marginTop: 75,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  iconWrapper: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    padding: 15
  },
  iconText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
    minWidth: 65,
    marginTop: 5,
    textAlign: 'center'
  }
});

export default Home;
