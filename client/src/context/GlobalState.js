import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';
import axios from 'axios';

// ✅ Production backend URL
const API_URL = "https://expense-tracker-mern-stack-4qpy.onrender.com";

// Initial state
const initialState = {
  transactions: [],
  error: null,
  loading: true
};

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions
  async function getTransactions() {
    try {
      console.log("🔄 Fetching transactions...");
      const res = await axios.get(`${API_URL}/api/v1/transactions`);

      dispatch({
        type: 'GET_TRANSACTIONS',
        payload: res.data.data
      });
    } catch (err) {
      console.error("❌ Error Fetching Transactions:", err);
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response?.data?.error || "Server Error"
      });
    }
  }

  async function deleteTransaction(id) {
    try {
      console.log(`🗑 Deleting transaction ${id}...`);
      await axios.delete(`${API_URL}/api/v1/transactions/${id}`);

      dispatch({
        type: 'DELETE_TRANSACTION',
        payload: id
      });
    } catch (err) {
      console.error("❌ Error Deleting Transaction:", err);
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response?.data?.error || "Server Error"
      });
    }
  }

  async function addTransaction(transaction) {
    try {
      console.log("➕ Adding new transaction...");
      const res = await axios.post(`${API_URL}/api/v1/transactions`, transaction, {
        headers: { 'Content-Type': 'application/json' }
      });

      dispatch({
        type: 'ADD_TRANSACTION',
        payload: res.data.data
      });
    } catch (err) {
      console.error("❌ Error Adding Transaction:", err);
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response?.data?.error || "Server Error"
      });
    }
  }

  return (
    <GlobalContext.Provider value={{
      transactions: state.transactions,
      error: state.error,
      loading: state.loading,
      getTransactions,
      deleteTransaction,
      addTransaction
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
