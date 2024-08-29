import React from 'react';

const CartPopup = ({ items, onCheckout, onClose, initialProduct }) => {
    const [selectedItems, setSelectedItems] = React.useState(
      items.map(item => ({ ...item, selected: true })) // Initialize all items as selected
    );

    // Handle checkbox change to toggle selection
    const handleCheckboxChange = (id) => {
      setSelectedItems(prevItems =>
        prevItems.map(item =>
          item._id === id ? { ...item, selected: !item.selected } : item
        )
      );
    };

    // Handle the confirm action
    const handleConfirm = () => {
        // Filter out items that are selected
        const filteredItems = selectedItems.filter(item => item.selected);
        onCheckout(filteredItems);
    };

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-lg font-semibold mb-4">Confirm Your Order</h2>
          <div className="mb-4">
            <h3 className="text-md font-medium mb-2">Product Details</h3>
            <div className="flex items-center mb-2">
              <img
                src={`http://localhost:5000${initialProduct.image}`}
                alt={initialProduct.name}
                className="w-16 h-16 object-contain mb-2"
              />
              <div className="ml-2">
                <p><strong>Price:</strong> {initialProduct.price}</p>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-md font-medium mb-2">Cart Items</h3>
            {selectedItems.map(item => (
              <div key={item._id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={item.selected || false}
                  onChange={() => handleCheckboxChange(item._id)}
                  className="mr-2"
                />
                <div className="flex items-center">
                  <img
                    src={`http://localhost:5000${item.product.image}`}
                    alt={item.product.name}
                    className="w-16 h-16 object-contain"
                  />
                  <div className="ml-2">
                    <p><strong>Price:</strong> {item.product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleConfirm}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
            >
              Confirm
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default CartPopup;
