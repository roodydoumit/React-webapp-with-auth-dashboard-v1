export type Role = 'admin' | 'operator' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface DashboardTile {
  id: string;
  title: string;
  section: 'admin' | 'client' | 'user' | 'kpi';
  status: 'active' | 'pending' | 'urgent';
  value: string;
  detail: string;
}
