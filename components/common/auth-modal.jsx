"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLogin } from "@/hooks/use-auth";

const AuthModal = ({ setShowAuthModal }) => {
  const { mutate } = useLogin();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = () => {
    const fd = new FormData();
    fd.append("email", formData.email);
    fd.append("password", formData.password);

    mutate(fd);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-[#1e3a5f]/60 backdrop-blur-sm"
        onClick={() => setShowAuthModal(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal Content */}
      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
                stroke="#2d3e54"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
                stroke="#2d3e54"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Sign in to save this item
        </h3>
        <p className="text-sm text-gray-600 text-center mb-6">
          Access your saved designs, track orders, and get AI visualizations
          instantly.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                onChange={onChange}
                value={formData.email}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d3e54] focus:border-transparent placeholder:text-gray-400 text-black"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={onChange}
                value={formData.password}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d3e54] focus:border-transparent placeholder:text-gray-400 text-black"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-[#2d3e54] text-white py-3 rounded-xl font-semibold text-base hover:bg-[#1e2d3d] transition-colors mb-4 flex items-center justify-center gap-2"
          >
            Log in
          </motion.button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 uppercase text-xs">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-black"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M18.1711 8.36202H17.5001V8.33335H10.0001V11.6667H14.7095C14.0228 13.6067 12.1761 15 10.0001 15C7.23883 15 5.00016 12.7613 5.00016 10C5.00016 7.23869 7.23883 5.00002 10.0001 5.00002C11.2748 5.00002 12.4313 5.48102 13.3161 6.26635L15.6741 3.90835C14.1858 2.52202 12.1945 1.66669 10.0001 1.66669C5.39816 1.66669 1.66683 5.39802 1.66683 10C1.66683 14.602 5.39816 18.3334 10.0001 18.3334C14.6021 18.3334 18.3335 14.602 18.3335 10C18.3335 9.44102 18.2788 8.89469 18.1711 8.36202Z"
                fill="#FFC107"
              />
              <path
                d="M2.62744 6.12119L5.36527 8.12919C6.10694 6.29486 7.90077 5.00019 10.0001 5.00019C11.2748 5.00019 12.4313 5.48119 13.3161 6.26652L15.6741 3.90852C14.1858 2.52219 12.1945 1.66686 10.0001 1.66686C6.79911 1.66686 4.02327 3.47386 2.62744 6.12119Z"
                fill="#FF3D00"
              />
              <path
                d="M9.99977 18.3333C12.1531 18.3333 14.1081 17.5096 15.5868 16.17L13.0084 13.9875C12.1432 14.6452 11.0865 15.0008 9.99977 15C7.83144 15 5.98977 13.618 5.2981 11.6892L2.5791 13.7829C3.95577 16.4817 6.7591 18.3333 9.99977 18.3333Z"
                fill="#4CAF50"
              />
              <path
                d="M18.1713 8.36202H17.5003V8.33335H10.0003V11.6667H14.7097C14.3763 12.5902 13.7859 13.3972 13.0071 13.9879L13.0088 13.9867L15.5871 16.1692C15.4046 16.3359 18.3336 14.1667 18.3336 10C18.3336 9.44102 18.2788 8.89469 18.1713 8.36202Z"
                fill="#1976D2"
              />
            </svg>
            Google
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-black"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M16.2379 10.6154C16.2476 11.4423 16.4716 12.2507 16.8879 12.9639C17.3042 13.677 17.8994 14.2707 18.6141 14.6858C18.2004 15.5021 17.6444 16.2397 16.9721 16.8655C16.2999 17.4913 15.5231 17.9946 14.6795 18.3519C13.236 18.9005 11.6666 18.9005 10.2231 18.3519C9.37946 17.9946 8.60264 17.4913 7.93042 16.8655C7.2582 16.2397 6.70215 15.5021 6.28846 14.6858C6.70475 14.2707 7.29995 13.677 7.71626 12.9639C8.13258 12.2507 8.35657 11.4423 8.36629 10.6154V9.38462C8.35657 8.55769 8.13258 7.74928 7.71626 7.03614C7.29995 6.32299 6.70475 5.72929 6.28846 5.31423C6.70215 4.49787 7.2582 3.76029 7.93042 3.13448C8.60264 2.50867 9.37946 2.00544 10.2231 1.64808C11.6666 1.09945 13.236 1.09945 14.6795 1.64808C15.5231 2.00544 16.2999 2.50867 16.9721 3.13448C17.6444 3.76029 18.2004 4.49787 18.6141 5.31423C17.8994 5.72929 17.3042 6.32299 16.8879 7.03614C16.4716 7.74928 16.2476 8.55769 16.2379 9.38462V10.6154Z"
                fill="black"
              />
              <path
                d="M10 10C10 8.67392 9.47322 7.40215 8.53553 6.46447C7.59785 5.52678 6.32608 5 5 5C3.67392 5 2.40215 5.52678 1.46447 6.46447C0.526784 7.40215 0 8.67392 0 10C0 11.3261 0.526784 12.5979 1.46447 13.5355C2.40215 14.4732 3.67392 15 5 15C6.32608 15 7.59785 14.4732 8.53553 13.5355C9.47322 12.5979 10 11.3261 10 10Z"
                fill="black"
              />
            </svg>
            Apple
          </motion.button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <button className="text-[#2d3e54] font-semibold hover:underline">
              Create an account
            </button>
          </p>
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.6667 6.41667H2.33333C1.8731 6.41667 1.5 6.78976 1.5 7.25V11.6667C1.5 12.1269 1.8731 12.5 2.33333 12.5H11.6667C12.1269 12.5 12.5 12.1269 12.5 11.6667V7.25C12.5 6.78976 12.1269 6.41667 11.6667 6.41667Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.5 6.41667V4.08333C3.5 3.42862 3.76339 2.80087 4.23223 2.33204C4.70107 1.8632 5.32881 1.6 5.98352 1.6H8.01648C8.67119 1.6 9.29893 1.8632 9.76777 2.33204C10.2366 2.80087 10.5 3.42862 10.5 4.08333V6.41667"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Your project data is secure and private
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;
