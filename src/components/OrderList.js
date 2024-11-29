import { Text, Image, StyleSheet } from 'react-native';
import React, { useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import Button from './Button';
import { Row, Col } from './Grid';
import { formatCurrency } from '../utils/formatCurrency';
import { useColorScheme } from 'react-native';
import Countdown from './Countdown';

const STATUS_COLOR = {
  paid: '#5CB85F',
  cancelled: '#A43333',
};

export default function OrderList({
  onPress,
  onCountdownEnd,
  date,
  carName,
  overdue,
  status,
  price,
  style,
})
{
  const isDarkMode = useColorScheme() === 'dark';
  const formatIDR = useCallback((price) => formatCurrency.format(price), []);
  // const handleFinish = (id) => {
  //   dispatch(cancelOrder(id))
  // }
  return (
    <Button style={{
        backgroundColor: isDarkMode ? '#121212' : '#fff',
        ...styles.card,
        ...style,
        }}
        onPress={onPress}
    >
      <Row alignItems={'center'} justifyContent={'space-between'} gap={20} style={styles.row}>
        <Col>
          <Text style={{
              color: isDarkMode ? '#fff' : '#000',
              ...styles.carName,
            }}>{carName}</Text>
        </Col>
        <Col>
          {status === 'pending' ? 
            <Countdown until={overdue} onFinish={onCountdownEnd}/>
          :
            <Text style={{color: STATUS_COLOR[status]}}>{status}</Text>
          }
        </Col>
      </Row>
      <Row gap={5} alignItems={'center'} justifyContent={'space-between'}>
        <Col>
          <Text style={{
            color: isDarkMode ? '#fff' : '#8b8c8b',
            
            ...styles.dateText,
          }}>{date}</Text>
        </Col>
        <Col>
          <Text style={styles.price}>{formatIDR(price)}</Text>
        </Col>
      </Row>
    </Button>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: 'rgba(0,0,0,1)',
    elevation: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    borderWidth: 0.5,
    borderRadius: 2,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 12,
    alignItems: 'flex-start',
  },
  row:{
    marginBottom: 5,
  },
  img: {
    width: 80,
    height: 80,
    objectFit: 'contain',
  },
  carName: {
    fontSize: 14,
  },
  capacityText: {
    color: '#8A8A8A',
  },
  dateText:{
    fontSize: 11,
  },
  textIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
