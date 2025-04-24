import { fetchProducts } from "../../app/utils/getProductsService";
import { filterProducts } from "../../app/utils/filterProducts";
jest.mock('../../app/utils/getProductsService');
const mockedProducts = [
    {
        id: 1,
        name: 'T-shirt',
        description: 'V-neck cotton T-shirt',
        image: '...',
        price: 39.99,
        materialBadge: 'Vegan',
        variants: [
            {
                id: 1,
                colorName: 'Red',
                colorHex: '#FF0000',
                image: '',
                sizes: [
                    { size: 'M', inStock: true },
                    { size: 'L', inStock: true },
                    { size: 'S', inStock: false },
                ],
            },
        ],
    },
    {
        id: 2,
        name: 'Hoodie',
        description: 'Cozy hoodie',
        image: '...',
        price: 59.99,
        materialBadge: 'Organic',
        variants: [
            {
                id: 2,
                colorName: 'Black',
                colorHex: '#000',
                image: '',
                sizes: [
                    { size: 'S', inStock: false },
                    { size: 'M', inStock: false },
                    { size: 'L', inStock: false },
                ],
            },
        ],
    },
];

describe('filterProducts with size and material', () => {
    beforeEach(() => {
        (fetchProducts as jest.Mock).mockResolvedValue(mockedProducts);
    });

    it('filters by in-stock size', async () => {
        const products = await fetchProducts();
        const result = filterProducts(products, {
            colorFilter: ['Red'],
            maxPrice: 50,
            sizeFilter: ['M'], // Only M size in-stock in T-shirt
        });

        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('T-shirt');
    });

    it('excludes items without matching in-stock size', async () => {
        const products = await fetchProducts();
        const result = filterProducts(products, {
            colorFilter: ['Red'],
            maxPrice: 50,
            sizeFilter: ['S'], // S is out of stock in all products
        });

        expect(result).toHaveLength(0);
    });

    it('filters by material badge', async () => {
        const products = await fetchProducts();
        const result = filterProducts(products, {
            colorFilter: ['Red', 'Black'],
            maxPrice: 60,
            materialFilter: ['Organic'], // Only Hoodie has Organic
        });

        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Hoodie');
    });

    it('filters by material,size,color,price', async () => {
        const products = await fetchProducts();
        const result = filterProducts(products, {
            colorFilter: ['Red'],
            maxPrice: 50,
            sizeFilter: ['L'],
            materialFilter: ['Vegan'],
        });

        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('T-shirt');
    });
});