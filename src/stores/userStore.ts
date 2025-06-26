import { makeAutoObservable, action } from "mobx";

import type { Customer } from "../types/interfaces/customer.interface";

class UserStore {
  user: Customer | null = null;
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this, {
      setUser: action,
      clearUser: action,
      setLoading: action,
    });
  }

  setUser = (user: Customer) => {
    this.user = user;
  };

  clearUser = () => {
    this.user = null;
  };

  setLoading = (loading: boolean) => {
    this.loading = loading;
  };
}

const userStore = new UserStore();
export { userStore };
export default UserStore;
