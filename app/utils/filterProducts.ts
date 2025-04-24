export interface Product {
    id: number;
    name: string;
    description: string;
    image: string;
    price: number;
    materialBadge: string;
    variants: Variant[];
}

interface Variant {
    id: number;
    colorName: string;
    colorHex: string;
    image: string;
    sizes: {
        size: string;
        inStock: boolean;
    }[];
}

interface FilterOptions {
    colorFilter: string[];
    maxPrice: number;
    sizeFilter?: string[];
    materialFilter?: string[];
}

export const filterProducts = (
    products: Product[],
    { colorFilter, maxPrice, sizeFilter = [], materialFilter = [] }: FilterOptions
): Product[] => {
    return products.filter((product) => {
        const matchesPrice = product.price <= maxPrice;
        const matchesMaterial =
            materialFilter.length === 0 || materialFilter.includes(product.materialBadge);

        const hasMatchingVariant = product.variants.some((variant) => {
            const matchesColor = colorFilter.length === 0 || colorFilter.includes(variant.colorName);
            const hasSizeInStock =
                sizeFilter.length === 0 ||
                variant.sizes.some(
                    (s) => sizeFilter.includes(s.size) && s.inStock
                );

            return matchesColor && hasSizeInStock;
        });

        return matchesPrice && matchesMaterial && hasMatchingVariant;
    });
};