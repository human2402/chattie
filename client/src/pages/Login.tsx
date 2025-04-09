import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/chibgu-mes-blue.svg';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  position: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    login: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: credentials.login,
          password: credentials.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка авторизации');
      }

      const data: LoginResponse = await response.json();
      
      // Save token to localStorage
      login(data.token, data.user);
      
      // Redirect to dashboard
      navigate('/' );

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Произошла неизвестная ошибка');
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center  px-6 py-12 lg:px-8">
      <div className="mx-auto w-full max-w-md bg-white rounded-xl shadow-lg px-8 py-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src={logo}
            className="mx-auto h-40 w-auto text-gray-900 "
          />
          <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Вход в аккаунт сотрудника
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="login" className="block text-sm font-medium leading-6 text-gray-900">
                Логин 
              </label>
              <div className="mt-2">
                <input
                  id="login"
                  name="login"
                  type="text"
                  required
                  value={credentials.login}
                  onChange={(e) => setCredentials({...credentials, login: e.target.value})}
                  className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Пароль
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold cl-blue1 ">
                    Забыл пароль?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="block w-full rounded-md border-0 py-2 px-4  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="bg-blue1 flex mt-10 w-full justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Вход
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
