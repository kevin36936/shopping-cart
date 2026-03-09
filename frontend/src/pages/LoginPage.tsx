import LoginForm from "../components/LoginForm";
import {useUser} from "../contexts/UserContext";

export default function LoginPage() {
    const { login } = useUser();  // ← 只需要 login，唔需要 user 同 logout
  
    return (
      <div className="mb-8">
        <LoginForm onLoginSuccess={login} />
      </div>
    );
  }
  