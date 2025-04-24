import React, { useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image as ExpoImage } from "expo-image";
// 1. Define the product type
type Product = {
    id: number;
    name: string;
    price: number;
    description?: string;
    image?: string;
    materialBadge: string;
    variants: [{ id: number, colorName: string, colorHex: string, image: string, sizes: [{ size: string, inStock: boolean }] }];
};

// 2. Define props for the component
type ProductListItemProps = {
    product: Product;
};

export default function ProductListItem({ product }: ProductListItemProps) {

    const [selectedColor, setSelectedColor] = useState(product.variants[0]);

    return (
        <View style={styles.productCard}>
            <ExpoImage
                source={{ uri: selectedColor.image }}
                style={styles.image}
                contentFit="cover"
                placeholder={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...'}
                transition={100}
            />
            <View style={styles.topRightIcons}>
                <TouchableOpacity style={styles.circleButton}>
                    <Ionicons name="heart-outline" size={18} color="red" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.circleButton}>
                    <Ionicons name="bag-outline" size={18} color="black" />
                </TouchableOpacity>
            </View>
            <View style={styles.bottomLeftText}>
                {!!product.materialBadge && <Text style={styles.clothTypeText}>{product.materialBadge}</Text>}
            </View>
            <Text style={styles.name}>{product.name}</Text>
            <View style={styles.priceContainer}>
                <Text style={styles.price}>{product.price} €</Text>
            </View>
            <View style={styles.colorsContainer}>
                {product.variants.map((variant) => (
                    <TouchableOpacity
                        key={variant.id}
                        style={[
                            styles.colorCircle,
                            { backgroundColor: variant.colorHex },
                            selectedColor === variant && styles.selected,
                        ]}
                        onPress={() => { setSelectedColor(variant) }}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    productCard: {
        width: '50%',
        backgroundColor: '#f9f9f9',
        justifyContent: "space-between",
        marginHorizontal: 2,
        marginTop: 10
    },
    image: { height: 240 },
    topRightIcons: {
        position: "absolute",
        top: 15,
        right: 15,
        gap: 12,
        flexDirection: "column",
    },
    circleButton: {
        backgroundColor: 'white',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // For shadow on Android
        shadowColor: '#000', // For shadow on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    bottomLeftText: {
        position: "absolute",
        top: 220,
        left: 10,
        gap: 12,
        backgroundColor: "#3B8657",
        flexDirection: "column"
    },
    clothTypeText: { fontSize: 14, color: "#fff", textTransform: "uppercase" },
    name: { fontSize: 14, marginTop: 8 },
    priceContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    price: { fontWeight: 'bold', fontSize: 16, color: '#010101' },
    colorsContainer: {
        flexDirection: "row",
        marginTop: 5,
        marginBottom: 5
    },
    colorCircle: {
        width: 25,
        height: 25,
        borderRadius: 12,
        borderWidth: 2,
        marginVertical: 2,
        marginHorizontal: 2,
        borderColor: '#ccc',
    },
    selected: {
        borderColor: '#000',
        borderWidth: 3,
    },

})
