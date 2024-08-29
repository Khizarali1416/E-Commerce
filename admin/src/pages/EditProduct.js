import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const EditProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [product, setProduct] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State for success message

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/admin/product/${productId}`);
                setProduct(response.data);
                setValue('name', response.data.name);
                setValue('price', response.data.price);
                setValue('description', response.data.description);
                setValue('category', response.data.category);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();

    }, [productId, setValue]);

    const onSubmit = async (data) => {
        try {
            const updatedProduct = { ...data };
            await axios.put(`http://localhost:5000/api/admin/product/${productId}`, updatedProduct);
            setShowSuccessMessage(true); // Show success message
            setTimeout(() => {
                setShowSuccessMessage(false); // Hide success message after 3 seconds
                navigate(`/products/${productId}`); // Redirect to product detail page
            }, 3000);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <>
        {showSuccessMessage && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                            <p className="font-bold">Product updated successfully!</p>
                        </div>
                    )}
        <div className="container mx-auto px-4 py-8">
            {product && (
                <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Product Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            defaultValue={product.name}
                            {...register('name', { required: 'Name is required' })}
                            placeholder="Enter product name"
                            className="mt-1 px-3 py-2 border rounded-lg w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Price
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            defaultValue={product.price}
                            {...register('price', { required: 'Price is required', valueAsNumber: true })}
                            placeholder="Enter price"
                            className="mt-1 px-3 py-2 border rounded-lg w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            defaultValue={product.description}
                            {...register('description', { required: 'Description is required' })}
                            placeholder="Enter description"
                            className="mt-1 px-3 py-2 border rounded-lg w-full h-32 resize-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            defaultValue={product.category}
                            {...register('category', { required: 'Category is required' })}
                            placeholder="Enter category"
                            className="mt-1 px-3 py-2 border rounded-lg w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            )}
        </div>
        </>
    );
};

export default EditProduct;
