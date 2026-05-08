import { getUser } from '@/lib/auth';
import Sidebar from '../../components/app/sidebar';

export default async function Layout({ children }) {
  const user = await getUser();
  return <Sidebar user={user}>{children}</Sidebar>;
}