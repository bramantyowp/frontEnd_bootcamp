import React, { useState, useEffect, useCallback, memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment'; 'moment';

const Countdown = memo(({ until, onFinish, size = 20, digitStyle, digitTxtStyle, timeLabelStyle, timeToShow = ['H', 'M', 'S']}) => {
    const getTimeLeft = useCallback(() => {
        const currentDate = new moment();
        const untilDate = new moment(until);
        const diff = untilDate.diff(currentDate);

        return moment.duration(diff <= 0 ? 0 : diff);
    }, [until]);

    const [timeLeft, setTimeLeft] = useState(getTimeLeft());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeLeft((prev) => {
                if(prev.milliseconds() <= 0){
                    clearInterval(intervalId);
                    onFinish && onFinish();
                    return getTimeLeft();
                }
                return getTimeLeft();
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [getTimeLeft, onFinish]);

    const formatTime = (time) => {
        return String(time).padStart(2, '0');
    };

    const hours = timeLeft.days() * 24 + timeLeft.hours();
    const minutes = timeLeft.minutes();
    const seconds =  timeLeft.seconds();

    // const hours = Math.floor(timeLeft / 3600);
    // const minutes = Math.floor((timeLeft % 3600) / 60 );
    // const seconds =  Math.floor(timeLeft % 60);

    const displayTime = timeToShow.map((unit) => {
        let value;
        switch (unit) {
            case 'H':
                value = hours;
                break;
            case 'M':
                value = minutes;
                break;
            case 'S':
                value = seconds;
                break;
            default:
                value = 0;
        }
        return (
            <View style={styles.timeUnit} key={unit}>
                <View style={styles.timeWrapper}>
                    <Text style={[styles.digit, digitStyle]}>{formatTime(value, unit)}</Text>
                    {unit !== 'S' && <Text style={styles.separator}>:</Text>}
                </View>
                {/* <Text style={[styles.timeLabel, timeLabelStyle]}>{unit}</Text> */}
            </View>
        );
    });

    return (
        <View style={styles.container}>
            {displayTime}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    timeUnit: {
        alignItems: 'center',
    },
    digit: {
        fontWeight: 'bold',
        backgroundColor: 'red',
        padding: 3,
        color: 'white',
        borderRadius: 3,
    },
    timeWrapper:{
        flexDirection: 'row',
    },
    separator:{
        fontWeight: '700',
        marginHorizontal: 2,
    },
});

export default Countdown;
