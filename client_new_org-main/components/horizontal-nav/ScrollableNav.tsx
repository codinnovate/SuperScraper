import React, {useState} from 'react';
import { FlatList, Text, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Body } from '@/styles/typography';
import Colors from '@/styles/colors';



  
  export default function ScrollableNav({NAV_ITEMS}) {
    const [selectedId, setSelectedId] = useState(null);
    const router = useRouter();

    const renderNavs = ({ item }) => {
      const isSelected = item.id === selectedId;
      const backgroundColor = isSelected ? Colors.primary:  Colors.buttonLight;
      const textColor = isSelected ? Colors.primaryLight:  Colors.primaryDark;
      const fontFamily = isSelected ?  "SEMIBOLD" :  "REGULAR";
  
      return (
        <TouchableOpacity
          onPress={() => {
            setSelectedId(item.id);
            router.push(item.route)
          }}
          style={[styles.item, { backgroundColor }]}
        >
          <Body style={{ color: textColor, fontFamily: fontFamily }}>{item.title}</Body>
        </TouchableOpacity>
      );
    };
    
    return (
      <FlatList
        data={NAV_ITEMS}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
        renderItem={renderNavs}
      />
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      paddingBottom: 8,
    },
    item: {
      marginRight: 12,
      backgroundColor: '#eee',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
    },
    text: {
      fontWeight: '600',
    },
  });
  