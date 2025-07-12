import { createContext, useState, useEffect , useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "./cartContext";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const {clearCart} = useCart();
    let navigate=useNavigate;
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post("https://clothing-mern-project-server.onrender.com/api/auth/login", { email, password });
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
    };

    const signup = async (name, email, password) => {
        const { data } = await axios.post("https://clothing-mern-project-server.onrender.com/api/auth/signup", { name, email, password });
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
    };

    const logout = () => {
        setUser(null);
        clearCart();
        localStorage.removeItem("user");
    };

    return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
