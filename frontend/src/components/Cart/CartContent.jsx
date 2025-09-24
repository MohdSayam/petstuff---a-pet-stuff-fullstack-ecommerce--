import React from "react";
import { MdDeleteOutline } from "react-icons/md";

const CartContent = () => {
  const cartProducts = [
    {
      productId: 1,
      name: "DogFood",
      quantity: 1,
      price: 12.55,
      image: "https://picsum.photos/100?random=1",
    },
    {
      productId: 1,
      name: "CatFood",
      quantity: 1,
      price: 21.23,
      image: "https://picsum.photos/100?random=2",
    },
  ];
  cartProducts.forEach((item) => {
    item.extra = (1.25 * item.price).toFixed(2);
  });
  return (
    <>
      <div>
        {cartProducts.map((product, index) => (
          <div
            key={index}
            className="flex items-start justify-between py-4 text-slate-700 border-green-400 border-1 p-3 mb-4 rounded-lg"
          >
            <div className="flex items-start  ">
              <img
                className="w-20 object-cover mr-4 h-24 rounded "
                src={product.image}
                alt={product.name}
              />
              <div>
                <h3 className="my-2 text-center">{product.name}</h3>
                <div className="flex flex-start w-24 bg-gray-200 rounded-2xl my-4 items-center justify-between">
                  <button className="p-1 text-3xl ml-1 text-emerald-600 hover:text-emerald-700 cursor-pointer">
                    -
                  </button>
                  <h6>{product.quantity}</h6>
                  <button className="p-1 text-3xl mr-1 text-emerald-600 hover:text-emerald-700 cursor-pointer">
                    +
                  </button>
                </div>
              </div>

              <div className="ml-8 my-2">
                <h3 className="font-bold ">${product.price}</h3>
                <p className="line-through text-sm">${product.extra}</p>
                <button>
                  <MdDeleteOutline className="text-emerald-700 text-2xl mt-2 ml-3 cursor-pointer" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CartContent;
