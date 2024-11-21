import Link from 'next/link';
import { useRouter } from 'next/router';

// ... existing code ...

function NavigationBar() {
  const router = useRouter();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Bookings', path: '/bookings' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav>
      <ul>
        {navItems.map((item) => (
          <li key={item.name} className={router.pathname == item.path ? 'active' : ''}>
            <Link href={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NavigationBar; 