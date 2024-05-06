import styles from '@/styles/navbarButton.module.css';
import Link from 'next/link';

interface NavbarButtonProps {
  text: string;
  href: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
}

const NavbarButton = ({ text, href, icon, onClick, isActive }: NavbarButtonProps) => {
  return (
    <Link onClick={onClick} href = {href}>
      <div className = {`${styles.navbarButton} ${isActive ? styles.navbarButtonActive : ''}`}>
        <div className = {styles.iconContainer}>
          {icon ? icon : null}
        </div>
        <div className = {styles.textContainer}>
            {text}
        </div>
      </div>
    </Link>
  )
}

export default NavbarButton;