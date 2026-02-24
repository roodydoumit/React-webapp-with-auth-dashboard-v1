import type { Role, User } from '../types';

const users = [
  { id: '1', name: 'Alice Admin', email: 'admin@xolog.com', password: 'admin123', role: 'admin' as Role },
  { id: '2', name: 'Omar Operator', email: 'operator@xolog.com', password: 'operator123', role: 'operator' as Role },
  { id: '3', name: 'Chris Customer', email: 'customer@xolog.com', password: 'customer123', role: 'customer' as Role },
];

const simulateMongoFetch = async <T,>(payload: T, delay = 700): Promise<T> => {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return payload;
};

export const authApi = {
  async login(email: string, password: string): Promise<User> {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials. Demo users: admin@xolog.com / operator@xolog.com / customer@xolog.com');
    }
    const { password: _pw, ...safeUser } = user;
    return simulateMongoFetch(safeUser);
  },
  async register(name: string, email: string, role: Role): Promise<User> {
    const safeUser = { id: String(Date.now()), name, email, role };
    return simulateMongoFetch(safeUser);
  },
  async forgotPassword(email: string): Promise<{ message: string }> {
    return simulateMongoFetch({ message: `Password reset instructions sent to ${email}` });
  },
};
