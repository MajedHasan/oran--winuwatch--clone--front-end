"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import { FiUser, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { HiOutlineGlobeAlt } from "react-icons/hi2";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const cartItems = [
    {
      id: 1,
      name: "Luxury Watch",
      price: "$999",
      image: "/watch.jpg",
      quantity: 1,
    },
    {
      id: 2,
      name: "Silk Shirt",
      price: "$249",
      image: "/shirt.jpg",
      quantity: 1,
    },
  ];

  return (
    <header className="bg-[#111111] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold text-[#d4af37]">
            WINUWATCH
          </Link>
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#d4af37] transition text-sm tracking-wide font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-1 hover:text-[#d4af37]">
              <HiOutlineGlobeAlt size={22} />
              <span className="text-sm hidden sm:inline">EN</span>
            </Menu.Button>
            <Transition as={Fragment} {...transitionProps}>
              <Menu.Items className="absolute right-0 mt-2 w-36 bg-white text-black rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                {["EN", "FR", "DE", "ES"].map((lang) => (
                  <Menu.Item key={lang}>
                    {({ active }) => (
                      <button
                        className={`flex w-full items-center px-4 py-2 text-sm ${
                          active ? "bg-gray-100" : ""
                        }`}
                      >
                        <span className="mr-2">🌐</span> {lang}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Profile Dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="hover:text-[#d4af37]">
              <FiUser size={20} />
            </Menu.Button>
            <Transition as={Fragment} {...transitionProps}>
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                <Menu.Item>
                  {({ active }) => (
                    <Link href="/profile" className={dropdownItem(active)}>
                      My Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link href="/login" className={dropdownItem(active)}>
                      Login
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link href="/register" className={dropdownItem(active)}>
                      Register
                    </Link>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Cart Dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="hover:text-[#d4af37] relative">
              <FiShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-[#d4af37] text-black text-xs px-1 rounded-full">
                {cartItems.length}
              </span>
            </Menu.Button>
            <Transition as={Fragment} {...transitionProps}>
              <Menu.Items className="absolute right-0 mt-2 w-80 bg-white text-black rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-30 p-4 space-y-4">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-semibold">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2">
                  <p className="text-sm text-gray-700">
                    Subtotal: <span className="font-semibold">$1248</span>
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Link
                      href="/cart"
                      className="w-1/2 text-center text-sm bg-gray-100 hover:bg-gray-200 rounded py-1"
                    >
                      View Cart
                    </Link>
                    <Link
                      href="/checkout"
                      className="w-1/2 text-center text-sm bg-[#d4af37] text-black hover:opacity-90 rounded py-1"
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden hover:text-[#d4af37]"
          >
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <Transition
        show={mobileOpen}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0 -translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-4"
      >
        <div className="md:hidden bg-[#111111] px-4 py-4 space-y-3 shadow text-white">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block hover:text-[#d4af37] text-base font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </Transition>
    </header>
  );
}

const dropdownItem = (active) =>
  `block px-4 py-2 text-sm ${active ? "bg-gray-100" : ""}`;

const transitionProps = {
  enter: "transition ease-out duration-200",
  enterFrom: "opacity-0 translate-y-1",
  enterTo: "opacity-100 translate-y-0",
  leave: "transition ease-in duration-150",
  leaveFrom: "opacity-100 translate-y-0",
  leaveTo: "opacity-0 translate-y-1",
};
