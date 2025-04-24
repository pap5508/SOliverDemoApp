import axios from 'axios';

export async function getProductsData() {
    return await axios.get("https://run.mocky.io/v3/2839b080-bd87-4276-865e-a6e865763ed5");
}


import { Product } from '../utils/filterProducts';

export const fetchProducts = async (): Promise<Product[]> => {
    const response = await fetch('https://run.mocky.io/v3/2839b080-bd87-4276-865e-a6e865763ed5');
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
};