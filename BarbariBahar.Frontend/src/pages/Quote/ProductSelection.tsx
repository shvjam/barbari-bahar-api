import React, { useEffect, useState } from 'react';
import { useQuote } from '../../context/QuoteContext';
import { fetchProductCategories, fetchProducts } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ProductSelection: React.FC = () => {
    const { orderData, updateOrder } = useQuote();
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [cart, setCart] = useState<any>({}); // { productId: quantity }
    const navigate = useNavigate();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const fetchedCategories = await fetchProductCategories();
                setCategories(fetchedCategories);
                if (fetchedCategories.length > 0) {
                    setSelectedCategory(fetchedCategories[0].id);
                }
            } catch (error) {
                console.error("Failed to load product categories", error);
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory !== null) {
            const loadProducts = async () => {
                try {
                    const fetchedProducts = await fetchProducts(selectedCategory);
                    setProducts(fetchedProducts);
                } catch (error) {
                    console.error(`Failed to load products for category ${selectedCategory}`, error);
                }
            };
            loadProducts();
        }
    }, [selectedCategory]);

    const handleAddToCart = (product: any) => {
        setCart((prevCart: any) => ({
            ...prevCart,
            [product.id]: (prevCart[product.id] || 0) + 1,
        }));
    };

    const handleRemoveFromCart = (product: any) => {
        setCart((prevCart: any) => {
            const newCart = { ...prevCart };
            if (newCart[product.id] > 1) {
                newCart[product.id] -= 1;
            } else {
                delete newCart[product.id];
            }
            return newCart;
        });
    };

    const handleNext = async () => {
        const cartItems = Object.keys(cart).map(productId => ({
            packagingProductId: parseInt(productId),
            quantity: cart[productId]
        }));

        try {
            await updateOrder({ cartItems });
            navigate('/quote/details');
        } catch (error) {
            console.error("Failed to update order with cart items", error);
        }
    };

    return (
        <div>
            <h2>Select Products</h2>
            <div>
                {categories.map(category => (
                    <button key={category.id} onClick={() => setSelectedCategory(category.id)}>
                        {category.name}
                    </button>
                ))}
            </div>
            <div>
                {products.map(product => (
                    <div key={product.id}>
                        <h3>{product.title}</h3>
                        <p>{product.unitPrice} تومان</p>
                        <div>
                            <button onClick={() => handleRemoveFromCart(product)}>-</button>
                            <span>{cart[product.id] || 0}</span>
                            <button onClick={() => handleAddToCart(product)}>+</button>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={handleNext}>Next</button>
        </div>
    );
};

export default ProductSelection;
