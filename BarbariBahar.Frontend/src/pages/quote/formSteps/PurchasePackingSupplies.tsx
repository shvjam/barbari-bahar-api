// src/pages/quote/formSteps/PurchasePackingSupplies.tsx
import React, { useEffect, useState } from 'react';
import { ProductService } from '../../../services/ProductService';
import { useQuote } from '../../../context/QuoteContext';
import { OrderService } from '../../../services/OrderService'; // Assuming this service exists

interface PackingItem {
    id: number;
    title: string;
    unit: string;
    unitPrice: number;
}

const PurchasePackingSupplies: React.FC = () => {
    const [items, setItems] = useState<PackingItem[]>([]);
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
    const { guestOrderId, setPriceDetails } = useQuote();

    useEffect(() => {
        ProductService.getPackingItems().then(setItems);
    }, []);

    const handleQuantityChange = (itemId: number, newQuantity: number) => {
        const updatedQuantities = { ...quantities, [itemId]: newQuantity };
        setQuantities(updatedQuantities);
        updateOrder(updatedQuantities);
    };

    const updateOrder = async (currentQuantities: { [key: number]: number }) => {
        if (!guestOrderId) return;

        const packingItems = Object.entries(currentQuantities)
            .filter(([, quantity]) => quantity > 0)
            .map(([productId, quantity]) => ({
                productId: Number(productId),
                quantity,
            }));

        const response = await OrderService.updateGuestOrder(guestOrderId, { packagingProducts: packingItems });
        setPriceDetails(response);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">اقلام بسته‌بندی مورد نیاز خود را انتخاب کنید</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => (
                    <div key={item.id} className="border p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold">{item.title}</h3>
                            <p>{item.unitPrice.toLocaleString()} تومان / {item.unit}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 0) + 1)}
                                className="bg-primary text-white rounded-full w-8 h-8 text-xl"
                            >
                                +
                            </button>
                            <span>{quantities[item.id] || 0}</span>
                            <button
                                onClick={() => handleQuantityChange(item.id, Math.max(0, (quantities[item.id] || 0) - 1))}
                                className="bg-gray-200 rounded-full w-8 h-8 text-xl"
                            >
                                -
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PurchasePackingSupplies;
