import { createContext, useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Load cart from localStorage
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("petstuff_cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Track selected items for checkout
    const [selectedItems, setSelectedItems] = useState([]);

    // Toast debounce ref to prevent duplicate toasts
    const toastRef = useRef(null);

    // Safe toast function that prevents duplicates
    const showToast = (message, type = 'success') => {
        if (toastRef.current) {
            toast.dismiss(toastRef.current);
        }
        if (type === 'success') {
            toastRef.current = toast.success(message);
        } else {
            toastRef.current = toast.error(message);
        }
    };

    // Totals calculated on the fly (only selected items for checkout)
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0);

    // Selected items totals for checkout
    const selectedTotalItems = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
    const selectedTotalPrice = selectedItems.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0);

    // Sync with localStorage
    useEffect(() => {
        localStorage.setItem("petstuff_cart", JSON.stringify(cartItems));
    }, [cartItems]);

    // Initialize selected items when cart loads
    useEffect(() => {
        setSelectedItems(cartItems);
    }, []);

    // Cart actions
    const addToCart = (product, quantity = 1) => {
        setCartItems((prev) => {
            const existingItem = prev.find((item) => item._id === product._id);

            if (existingItem) {
                if (existingItem.quantity + quantity > product.stock) {
                    showToast(`Sorry, only ${product.stock} left in stock!`, 'error');
                    return prev;
                }

                showToast("Cart updated!");
                return prev.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            // New item - also add to selected
            showToast("Added to cart!");
            const newItem = { ...product, quantity };
            setSelectedItems(prev => [...prev, newItem]);
            return [...prev, newItem];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prev) => prev.filter((item) => item._id !== productId));
        setSelectedItems((prev) => prev.filter((item) => item._id !== productId));
        showToast("Item removed");
    };

    const updateQuantity = (productId, newQuantity) => {
        setCartItems((prev) => prev.map((item) => {
            if (item._id === productId) {
                const quantity = Math.max(1, newQuantity);
                if (quantity > item.stock) {
                    showToast(`Max stock available is ${item.stock}`, 'error');
                    return { ...item, quantity: item.stock };
                }
                return { ...item, quantity };
            }
            return item;
        }));

        // Also update in selected items
        setSelectedItems((prev) => prev.map((item) => {
            if (item._id === productId) {
                const quantity = Math.max(1, newQuantity);
                if (quantity > item.stock) {
                    return { ...item, quantity: item.stock };
                }
                return { ...item, quantity };
            }
            return item;
        }));
    };

    // Toggle item selection for checkout
    const toggleItemSelection = (productId) => {
        const item = cartItems.find((item) => item._id === productId);
        if (!item) return;

        const isSelected = selectedItems.some((i) => i._id === productId);
        if (isSelected) {
            setSelectedItems((prev) => prev.filter((i) => i._id !== productId));
        } else {
            setSelectedItems((prev) => [...prev, item]);
        }
    };

    // Select all items
    const selectAllItems = () => {
        setSelectedItems([...cartItems]);
    };

    // Deselect all items
    const deselectAllItems = () => {
        setSelectedItems([]);
    };

    // Check if an item is selected
    const isItemSelected = (productId) => {
        return selectedItems.some((item) => item._id === productId);
    };

    const clearCart = () => {
        setCartItems([]);
        setSelectedItems([]);
        localStorage.removeItem("petstuff_cart");
    };

    // Clear only selected items after checkout
    const clearSelectedItems = () => {
        const selectedIds = selectedItems.map(item => item._id);
        setCartItems(prev => prev.filter(item => !selectedIds.includes(item._id)));
        setSelectedItems([]);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice,
            // Selection features
            selectedItems,
            selectedTotalItems,
            selectedTotalPrice,
            toggleItemSelection,
            selectAllItems,
            deselectAllItems,
            isItemSelected,
            clearSelectedItems
        }}>
            {children}
        </CartContext.Provider>
    );
};