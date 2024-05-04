import styles from '@/styles/navbarButton.module.css';
import Link from 'next/link';

interface NavbarButtonProps {
  text: string;
  href: string;
  icon?: React.ReactNode;
}

const NavbarButton = ({ text, href, icon }: NavbarButtonProps) => {
  return (
    <Link href = {href}>
      <div className = {styles.navbarButton}>
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