"use client";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export const INITIAL_USER: User = {
  $id: "",
  email: "",
  phone: "",
  userId: "",

  firstName: "",
  lastName: "",

  imageUrl: "",
};

const INITIAL_STATE: IContextType = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

// Utility function to get cookies by name
// function getCookie(name: string): string | undefined {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) {
//     const cookieValue = parts.pop();
//     if (cookieValue) {
//       return cookieValue.split(";").shift();
//     }
//   }
//   return undefined;
// }

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);


  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getLoggedInUser();
      if (currentAccount) {
        setUser({
          $id: currentAccount.$id,
          firstName: currentAccount.firstName,
          lastName: currentAccount.lastName,
          email: currentAccount.email,
          phone: currentAccount.phone,
          userId: currentAccount.userId,
      
          imageUrl: currentAccount.imageUrl,
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      localStorage.getItem("cookieFall") === "[]" ||
      localStorage.getItem("cookieFall") === null
    )
      redirect("/sign-in");

    checkAuthUser();
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
