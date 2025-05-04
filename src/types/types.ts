import { Timestamp } from "firebase/firestore";

// Defines the structure of a Product used across the app
export interface Product {
    id: number | string; // Can be from Fake Store API (number) or Firestore (string)
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
    quantity: number; // Quantity in cart or inventory
};

// Defines the structure of a registered user in the Firestore Database
export interface User {
    id?: string; // Firestore document ID is optional
    email: string;        
    name: string;  
    address: string; 
    phone: string;   
    createdAt: Date; // Timestamp of when user was created
};

// Represents an order placed by a user and stored in Firestore
export interface Order {
    id: string; // Firestore ID
    userId: string; // ID of user who placed the order
    items: {
        id: number;
        name: string;
        price: number;
        quantity: number;
    }[];
    total: number; // total cost of the order
    createdAt: Timestamp; // Firestore timestamp of order creation
}

// Represents the format of a product stored in Firestore
export interface FirestoreProduct {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    quantity: number;
}



