
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerLogin() {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/customer/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });

            if (response.ok) {
                const customer = await response.json();
                // Salvar no localStorage ou cookie
                localStorage.setItem('customer', JSON.stringify(customer));
                router.push('/customer/dashboard'); // Assuming dashboard exists or will be created
            } else {
                alert('Nenhuma compra encontrada com este número');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Erro ao tentar fazer login. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleLogin} className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Consultar Meus Números</h1>
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                    <input
                        id="phone"
                        type="tel"
                        placeholder="(21) 99999-9999"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                >
                    {loading ? 'Carregando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
}
