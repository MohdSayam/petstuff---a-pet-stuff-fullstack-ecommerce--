import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast"

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext()

export const CartProvider = ({children})=> {
    // initialize cart from localstorage if available
    const [cartItems, setCartItems] = useState(()=>{
        const savedCart = localStorage.getItem("petstuff_cart");
        return savedCart ? JSON.parse(savedCart) : [];
    })

    // total calcultaions we calculate on fly so they will always correct or accurate
    const totalItems = cartItems.reduce((acc,item)=> acc  + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0);

    // sync with local storage when this cart will load
    useEffect(()=>{
        localStorage.setItem("petstuff_cart", JSON.stringify(cartItems))
    },[cartItems])

    // some major actions
    const addToCart = (product, quantity = 1) => {
        setCartItems((prev) => {
            // Check if item already exists
            const existingItem = prev.find((item) => item._id === product._id);

            if (existingItem) {
                // Production Check: Don't exceed stock
                if (existingItem.quantity + quantity > product.stock) {
                    toast.error(`Sorry, only ${product.stock} left in stock!`);
                    return prev;
                }
                
                toast.success("Cart updated!");
                return prev.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            // If new item
            toast.success("Added to cart!");
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prev)=> prev.filter((item)=> item._id !== productId))
        toast.success("Item removed")
    }

    const updateQuantity = (productId, newQuantity)=>{
        setCartItems((prev)=>prev.map((item)=>{
            if (item._id === productId) {
                const quantity = Math.max(1, newQuantity)
                if (quantity > item.stock){
                    toast.error(`Max stock available is ${item.stock}`)
                    return {...item, quantity: item.stock};
                }
                return {...item, quantity}
            }
            return item
        })
    )}

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem("petstuff_cart");
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            clearCart,
            totalItems,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};