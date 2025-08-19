"use client";

import React, { useState } from "react";
import { FiPlus, FiTrash2, FiCreditCard, FiDollarSign } from "react-icons/fi";
import { SiPaypal, SiBitcoin } from "react-icons/si";

export default function WalletPage() {
  const [balance, setBalance] = useState(12450.75);
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "Credit Card",
      details: "**** **** **** 1234",
      default: true,
    },
    { id: 2, type: "PayPal", details: "user@example.com", default: false },
    { id: 3, type: "Crypto", details: "0x1234abcd...", default: false },
  ]);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "Deposit",
      amount: 500,
      date: "2025-08-14",
      method: "Credit Card",
    },
    {
      id: 2,
      type: "Withdraw",
      amount: 200,
      date: "2025-08-10",
      method: "PayPal",
    },
    {
      id: 3,
      type: "Deposit",
      amount: 1000,
      date: "2025-08-08",
      method: "Crypto",
    },
  ]);

  const [modalType, setModalType] = useState(""); // "add", "deposit", "withdraw"
  const [newMethodType, setNewMethodType] = useState("Credit Card");
  const [formData, setFormData] = useState({});

  const addPaymentMethod = () => {
    if (!formData.details) return;
    const newMethod = {
      id: Date.now(),
      type: newMethodType,
      details: formData.details,
      default: false,
    };
    setPaymentMethods([...paymentMethods, newMethod]);
    setFormData({});
    setModalType("");
  };

  const removePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter((m) => m.id !== id));
  };

  const setDefaultMethod = (id) => {
    setPaymentMethods(
      paymentMethods.map((m) => ({ ...m, default: m.id === id }))
    );
  };

  const handleDeposit = () => {
    if (!formData.amount) return;
    const amount = parseFloat(formData.amount);
    setBalance(balance + amount);
    setTransactions([
      {
        id: Date.now(),
        type: "Deposit",
        amount,
        date: new Date().toISOString().split("T")[0],
        method: formData.method || "Credit Card",
      },
      ...transactions,
    ]);
    setFormData({});
    setModalType("");
  };

  const handleWithdraw = () => {
    if (!formData.amount) return;
    const amount = parseFloat(formData.amount);
    if (amount > balance) return alert("Insufficient balance");
    setBalance(balance - amount);
    setTransactions([
      {
        id: Date.now(),
        type: "Withdraw",
        amount,
        date: new Date().toISOString().split("T")[0],
        method: formData.method || "Credit Card",
      },
      ...transactions,
    ]);
    setFormData({});
    setModalType("");
  };

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-b from-[#121212] to-[#1c1c1c] text-white">
      <h1 className="text-4xl font-bold text-[#d4af37] mb-8">My Wallet</h1>

      {/* Balance */}
      <section className="bg-[#1f1f1f] rounded-3xl p-8 shadow-lg mb-12">
        <h2 className="text-2xl font-semibold mb-4">Balance</h2>
        <p className="text-gray-300 text-lg">£{balance.toFixed(2)}</p>
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => setModalType("deposit")}
            className="bg-[#d4af37] text-black font-bold px-6 py-2 rounded-lg hover:bg-yellow-400 transition"
          >
            Deposit
          </button>
          <button
            onClick={() => setModalType("withdraw")}
            className="bg-[#d4af37] text-black font-bold px-6 py-2 rounded-lg hover:bg-yellow-400 transition"
          >
            Withdraw
          </button>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Payment Methods</h2>
          <button
            onClick={() => setModalType("add")}
            className="flex items-center gap-2 bg-[#d4af37] text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
          >
            <FiPlus /> Add Method
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-6 rounded-2xl shadow-lg flex justify-between items-center ${
                method.default ? "bg-yellow-100 text-black" : "bg-[#1f1f1f]"
              }`}
            >
              <div className="flex items-center gap-3">
                {method.type === "Credit Card" && <FiCreditCard size={28} />}
                {method.type === "PayPal" && <SiPaypal size={28} />}
                {method.type === "Crypto" && <SiBitcoin size={28} />}
                <span className="ml-2">{method.details}</span>
                {method.default && (
                  <span className="ml-2 text-sm text-gray-400">(Default)</span>
                )}
              </div>
              <div className="flex gap-2">
                {!method.default && (
                  <button
                    onClick={() => setDefaultMethod(method.id)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => removePaymentMethod(method.id)}
                  className="text-red-500 hover:text-red-400 transition"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Transactions */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#1f1f1f] rounded-2xl">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Method</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-gray-700 hover:bg-[#2a2a2a] transition"
                >
                  <td className="px-6 py-4 flex items-center gap-2">
                    {tx.type === "Deposit" ? (
                      <FiDollarSign />
                    ) : (
                      <FiCreditCard />
                    )}
                    {tx.type}
                  </td>
                  <td className="px-6 py-4">£{tx.amount}</td>
                  <td className="px-6 py-4">{tx.date}</td>
                  <td className="px-6 py-4">{tx.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#1f1f1f] rounded-3xl p-8 w-full max-w-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setModalType("")}
            >
              ✕
            </button>

            {/* Add Payment Method */}
            {modalType === "add" && (
              <>
                <h2 className="text-2xl font-bold text-[#d4af37] mb-6">
                  Add Payment Method
                </h2>
                <select
                  className="w-full p-3 mb-3 rounded-lg bg-[#121212] text-white"
                  value={newMethodType}
                  onChange={(e) => setNewMethodType(e.target.value)}
                >
                  <option>Credit Card</option>
                  <option>PayPal</option>
                  <option>Crypto</option>
                </select>
                {newMethodType === "Credit Card" && (
                  <>
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      className="w-full mb-3 p-3 rounded-lg bg-[#121212] text-white"
                      onChange={(e) =>
                        setFormData({ ...formData, cardholder: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full mb-3 p-3 rounded-lg bg-[#121212] text-white"
                      onChange={(e) =>
                        setFormData({ ...formData, details: e.target.value })
                      }
                    />
                    <div className="flex gap-3 mb-3">
                      <input
                        type="text"
                        placeholder="Expiry MM/YY"
                        className="w-1/2 p-3 rounded-lg bg-[#121212] text-white"
                        onChange={(e) =>
                          setFormData({ ...formData, expiry: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="w-1/2 p-3 rounded-lg bg-[#121212] text-white"
                        onChange={(e) =>
                          setFormData({ ...formData, cvv: e.target.value })
                        }
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Billing Address"
                      className="w-full mb-3 p-3 rounded-lg bg-[#121212] text-white"
                      onChange={(e) =>
                        setFormData({ ...formData, billing: e.target.value })
                      }
                    />
                  </>
                )}
                {newMethodType === "PayPal" && (
                  <input
                    type="email"
                    placeholder="PayPal Email"
                    className="w-full mb-3 p-3 rounded-lg bg-[#121212] text-white"
                    onChange={(e) =>
                      setFormData({ ...formData, details: e.target.value })
                    }
                  />
                )}
                {newMethodType === "Crypto" && (
                  <>
                    <input
                      type="text"
                      placeholder="Wallet Address"
                      className="w-full mb-3 p-3 rounded-lg bg-[#121212] text-white"
                      onChange={(e) =>
                        setFormData({ ...formData, details: e.target.value })
                      }
                    />
                    <select
                      className="w-full mb-3 p-3 rounded-lg bg-[#121212] text-white"
                      onChange={(e) =>
                        setFormData({ ...formData, network: e.target.value })
                      }
                    >
                      <option>Ethereum</option>
                      <option>BNB Smart Chain</option>
                      <option>Solana</option>
                      <option>Polygon</option>
                    </select>
                  </>
                )}
                <button
                  onClick={addPaymentMethod}
                  className="w-full mt-4 bg-[#d4af37] text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition"
                >
                  Add Method
                </button>
              </>
            )}

            {/* Deposit */}
            {modalType === "deposit" && (
              <>
                <h2 className="text-2xl font-bold text-[#d4af37] mb-4">
                  Deposit Funds
                </h2>
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-full mb-3 p-3 rounded-lg bg-[#121212] text-white"
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
                <select
                  className="w-full mb-3 p-3 rounded-lg bg-[#121212] text-white"
                  onChange={(e) =>
                    setFormData({ ...formData, method: e.target.value })
                  }
                >
                  {paymentMethods.map((m) => (
                    <option key={m.id} value={m.type}>
                      {m.type}: {m.details}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleDeposit}
                  className="w-full mt-2 bg-[#d4af37] text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition"
                >
                  Deposit
                </button>
              </>
            )}

            {/* Withdraw */}
            {modalType === "withdraw" && (
              <>
                <h2 className="text-2xl font-bold text-[#d4af37] mb-4">
                  Withdraw Funds
                </h2>
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-full mb-3 p-3 rounded-lg bg-[#121212] text-white"
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
                <select
                  className="w-full mb-3 p-3 rounded-lg bg-[#121212] text-white"
                  onChange={(e) =>
                    setFormData({ ...formData, method: e.target.value })
                  }
                >
                  {paymentMethods.map((m) => (
                    <option key={m.id} value={m.type}>
                      {m.type}: {m.details}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleWithdraw}
                  className="w-full mt-2 bg-[#d4af37] text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition"
                >
                  Withdraw
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
