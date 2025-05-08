import React, { useState, useEffect} from "react";
// import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc, getDocs, collection, query, where, Timestamp } from "firebase/firestore";
import { deleteUser as firebaseDeleteUser } from "firebase/auth";
import { User, Order } from "../types/types";
import firebase from "../firebaseConfig";
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';


const UserProfile = () => {
    const [userData, setUserData] = useState<User | null>(null);
    const [newName, setNewName] = useState<string>('');
    const [newAddress, setNewAddress] = useState<string>('');
    const [newPhone, setNewPhone] = useState<string>('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const [authInstance, setAuthInstance] = useState<Auth | null>(null);
    const [dbInstance, setDbInstance] = useState<Firestore | null>(null);
    useEffect(() => {
        firebase.then(({ auth, db }) => {
            setAuthInstance(auth)
            setDbInstance(db)
        })
    }, [])

    // useEffect hook to fetch user data and order history
    useEffect(() => {
        const fetchData = async() => {
            if (!authInstance) return;
            const currentUser = authInstance.currentUser;
            if (!currentUser) return;

            // fetch user profile from Firestore
            if (!dbInstance) return;
            const userDoc = await getDoc(doc(dbInstance, "users", currentUser.uid));
            if (userDoc.exists()) {
                const data = userDoc.data() as User;
                setUserData(data);
            }

            // fetch user's order history
            const ordersQuery = query(collection(dbInstance, "orders"), where ("userId", "==", currentUser.uid));
            const querySnapshot = await getDocs(ordersQuery);

            const fetchedOrders: Order[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<Order, "id">),
            }));
        setOrders(fetchedOrders);
    };

        fetchData(); 

    }, [authInstance, dbInstance]);

   // Update user profile
    const updateProfile = async () => {
        if (!authInstance) return;
        const currentUser = authInstance.currentUser;
        if (!currentUser) return;

        try {
            if (!dbInstance) return;
            const userRef = doc(dbInstance, "users", currentUser.uid);
        
            // update user data in Firestore
            await updateDoc(userRef, {
            name: newName || userData?.name, 
            address: newAddress || userData?.address, 
            phone: newPhone || userData?.phone,
        }); 

        // update local state with the updated user data
        setUserData((prevData) => {
            if (!prevData) return prevData;
        
            const updated: User = {
                ...prevData,
                name: newName || prevData.name,
                address: newAddress || prevData.address,
                phone: newPhone || prevData.phone,
            };

            return updated;
        });

        // clear the form fields after the update
        setNewName("");
        setNewAddress("");
        setNewPhone("");

        alert("User Profile has been successfully updated.")
        } catch (error) {
            console.error("Error updating profile: ", error);
        }
    };
    
    // delete user documents and Firebase auth
    const deleteAccount = async() => {
        if (!authInstance) return;
        const currentUser = authInstance.currentUser;
        if (!currentUser) return;
        try {
            if (!dbInstance) return; 
            await deleteDoc(doc(dbInstance,'users', currentUser.uid)); // deletes the User documents
            await firebaseDeleteUser(currentUser); // deletes the user from Firebase Auth
            alert("Account has been successfully deleted")
        } catch (error) {
            console.error("Error deleting account: ", error);
        }
    };

    // opens the modal with order details when clicking on order id link
    const openOrderDetails = (order: Order) => {
        setSelectedOrder(order);
    };

    // closes modal
    const closeModal = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 text-center">
            <div className="card p-4 shadow" style={{ minWidth: '600px' }}>
                <h3 className="text-center mb-4">User Profile</h3>

                {/* Display current user info */}
                <p><strong>Email:</strong> {authInstance?.currentUser?.email}</p>
                <p><strong>Name:</strong> {userData?.name || "Not set"}</p>
                <p><strong>Address:</strong> {userData?.address || "Not set"}</p>
                <p><strong>Phone:</strong> {userData?.phone || "Not set"}</p>
                
                <div className="mt-3 mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Update Name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Update Address"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <input 
                        type="text"
                        className="form-control"
                        placeholder="Update Phone"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                    />
                </div>

                <div className="d-flex justify-content-center align-items-center">
                    <button className="btn btn-primary w-25 me-2"onClick={updateProfile}>Update Profile</button>
                    <button className="btn btn-secondary w-25 me-2" onClick={deleteAccount}>Delete Account</button>
                </div>

                <hr />
                <h4>Order History</h4>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Cart ID</th>
                            <th>Date</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                            <td colSpan={3}>No orders found.</td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                            <tr key={order.id}>
                                <td>
                                <span
                                    style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                                    onClick={() => openOrderDetails(order)}
                                    >
                                    {order.id}
                                </span>
                                </td>
                                <td>{(order.createdAt.toDate()).toLocaleString()}</td>
                                <td>${order.total.toFixed(2)}</td>
                            </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for displaying order details */}
            {selectedOrder && (
                <div className="modal show" style={{ display: 'block' }} role="dialog" tabIndex={-1}>
                    <div className="modal-dialog modal-fullscreen" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Order Details - {selectedOrder.id}</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Order Date:</strong> {(selectedOrder.createdAt as Timestamp).toDate().toLocaleString()}</p>
                                <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
                                <p><strong>Items:</strong></p>
                                <ul className="list-group">
                                    {selectedOrder.items.map((item, index) => (
                                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{item.name}</strong> (x{item.quantity})
                                        </div>
                                        <div>${(item.price * item.quantity).toFixed(2)}</div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
        )}
        </div>
    );
};

export default UserProfile;