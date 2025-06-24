import React, { createContext, useContext } from "react";
import CartStore from "./cartStore";

class RootStore {
  cartStore: CartStore;

  constructor() {
    this.cartStore = new CartStore();
  }
}

const rootStore = new RootStore();
const StoreContext = createContext(rootStore);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return React.createElement(
    StoreContext.Provider,
    { value: rootStore },
    children
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
};

export default RootStore;
