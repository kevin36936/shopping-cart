import { useState } from "react";
import axios from "axios";
import type { LoginFormData, LoginFormProps } from "../types";

const LoginForm = ({onLoginSuccess}: LoginFormProps) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true);
    setError("");

    try {
        const res = await axios.post(`${API_URL}/api/login`, formData);
        const {token, user} = res.data;
        localStorage.setItem("token", token);
        onLoginSuccess(token, user);

    }
  }

  return  (
    <form >

    </form>
  )
};

export default LoginForm;