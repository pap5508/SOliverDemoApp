import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
// import dummyProducts from "../assets/dummyProducts.json";
import ProductListItem from './components/ProductListItem';
import Ionicons from '@expo/vector-icons/Ionicons';
import SortModal from './screen/SortingScreen';
import FilterModal from './screen/FilterModal';
import { getProductsData } from './utils/getProductsService';
import { filterProducts } from './utils/filterProducts';

type Product = {
    id: number;
    name: string;
    price: number;
    description?: string;
    image: string;
    materialBadge: string;
    variants: [{
        id: number, colorName: string, colorHex: string, image: string, sizes: [{
            size: string,
            inStock: boolean
        }];
    }];
}


export default function HomeScreen() {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [filterProduct, setFilterProduct] = useState<Product[] | null>(null);
    const [isSortModalVisible, setIsSortModalVisible] = useState(false);
    const [selectedSort, setSelectedSort] = useState('popular');
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});


    useEffect(() => {
        async function getData() {
            try {
                const response = await getProductsData();
                if (response.data) {
                    setAllProducts(response.data);
                    setProducts(response.data);
                }
            } catch (error) {
            }
        }
        getData();
    }, []);

    const handleSelectSort = (sortOption: string) => {
        setSelectedSort(sortOption);
        switch (sortOption) {
            case "price-desc":
                setProducts(products.sort((a, b) => b.price - a.price))
                break;
            case "price-asc":
                setProducts(products.sort((a, b) => a.price - b.price))
                break;
            default:
                setProducts(products.sort((a, b) => a.id - b.id))
                break;
        }
        console.log("selected sort: " + sortOption);
    };

    const handleApplyFilters = (filters: Record<string, string[]>) => {
        const selectedColors = filters['farbe'] || [];
        const selectedPrice = filters['preis']?.[0]; // single selection

        // Always use the full, unfiltered list
        let filtered = allProducts
            .map(product => {
                const matchCount = product.variants.filter(variant =>
                    selectedColors.includes(variant.colorName)
                ).length;

                return {
                    ...product,
                    matchCount,
                };
            })
            .filter(product =>
                selectedColors.length === 0 || product.matchCount > 0
            );

        // Apply price filter
        if (selectedPrice) {
            filtered = filtered.filter(product => {
                const price = product.price;
                switch (selectedPrice) {
                    case 'under_50':
                        return price < 50;
                    case '50_100':
                        return price >= 50 && price <= 100;
                    case 'above_100':
                        return price > 100;
                    default:
                        return true;
                }
            });
        }

        // Sort if color was applied
        if (selectedColors.length > 0) {
            filtered.sort((a, b) => b.matchCount - a.matchCount);
        }

        switch (selectedSort) {
            case "price-desc":
                setProducts(filtered.sort((a, b) => b.price - a.price))
                break;
            case "price-asc":
                setProducts(filtered.sort((a, b) => a.price - b.price))
                break;
            default:
                setProducts(filtered.sort((a, b) => a.id - b.id))
                break;
        }

        setActiveFilters(filters);
        setFilterProduct(filtered);
        setProducts(filtered);
    };

    const handleApplyFilterReset = (sortOption: string) => {
        setSelectedSort(sortOption);
        setActiveFilters({});
        setFilterProduct(null);
    }
    const displayData = filterProduct ? filterProduct : products;

    return (
        <SafeAreaView style={styles.container}>
            <View style={{
                flexDirection: "row", flex: 0.5,
                justifyContent: "space-around",
                paddingHorizontal: 12,
                paddingVertical: 10,
                alignItems: 'center', alignContent: "center"
            }}>

                <TouchableOpacity style={styles.button} onPress={() => setIsSortModalVisible(true)}>
                    <Ionicons name="swap-vertical-outline" size={24} color="black" />
                    <Text style={styles.label}>Beliebteste</Text>
                </TouchableOpacity>
                <SortModal
                    isVisible={isSortModalVisible}
                    onClose={() => setIsSortModalVisible(false)}
                    onSelectSort={handleSelectSort}
                    selectedSort={selectedSort}
                />
                {/* Filter button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setIsFilterModalVisible(true)}
                >
                    <Ionicons name="options-outline" size={24} color="black" />
                    <Text style={styles.label}>Filter</Text>

                    {Object.values(activeFilters).flat().length > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {Object.values(activeFilters).flat().length}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Filter modal */}
                <FilterModal
                    isVisible={isFilterModalVisible}
                    onClose={() => setIsFilterModalVisible(false)}
                    onApplyFilters={handleApplyFilters}
                    onApplyFilterReset={handleApplyFilterReset}
                />
            </View>
            {displayData.length === 0 ? (
                <View style={{ flex: 8, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: '#666' }}>No Items Found</Text>
                </View>
            ) : (
                    <View style={{ flex: 8 }}>
                        <FlatList
                            data={displayData}
                            numColumns={2}
                            contentContainerStyle={{ gap: 2, paddingBottom: 16 }}
                            renderItem={({ item }) => <ProductListItem product={item} />}
                            keyExtractor={(item) => item.id.toString()}
                            initialNumToRender={10}
                            maxToRenderPerBatch={10}
                            windowSize={5}
                        />
                    </View>
                )}
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 12, flexDirection: "column" },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 6,
    },
    icon: {
        color: '#000',
    },
    iconUpDown: {
        color: '#000',
        position: 'absolute',
        top: 6,
        left: 0,
    },
    badge: {
        backgroundColor: '#000',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
})