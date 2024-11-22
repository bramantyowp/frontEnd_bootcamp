import { View, Text, Image } from 'react-native'
import { useEffect } from 'react'

import { useSelector } from "react-redux";
import { selectOrder } from "../../../redux/reducers/order";

export default function Step3() {
    const { data } = useSelector(selectOrder);
    useEffect(() => {
        console.log(data);

    }, [])
    return (
        <View>
            {data.slip &&
                <Image
                    style={{
                        width: 100,
                        height: 100,
                        resizeMode: 'cover'
                    }}

                    source={{ uri: data.slip }}
                />
            }
        </View>
    )
}