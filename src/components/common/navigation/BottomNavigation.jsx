import { Link } from 'react-router-dom';
import './BottomNavigation.css';

export default function BottomNavigation() {
  return (
    <nav className="bottom-nav">
      <Link to="/" className={window.location.pathname === '/' ? 'active' : ''}>
        메인
      </Link>
      <Link to="/boardList" className={window.location.pathname.includes('/boardList') ? 'active' : ''}>
        게시판
      </Link>
      <Link to="/products" className={window.location.pathname.includes('/product') ? 'active' : ''}>
        상품
      </Link>
      <Link to="/mypage" className={window.location.pathname === '/mypage' ? 'active' : ''}>
        마이
      </Link>
    </nav>
  );
} 