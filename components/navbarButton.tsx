import styles from '@/styles/navbarButton.module.css';

interface NavbarButtonProps {
  text: string;
  href: string;
  icon?: React.ReactNode;
}

const NavbarButton = ({ text, href, icon }: NavbarButtonProps) => {
  return (
    <div className = {styles.navbarButton}>
      <div className = {styles.iconContainer}>
        {icon ? icon : null}
      </div>
      <div className = {styles.textContainer}>
        {text}
      </div>
    </div>
  )
}

export default NavbarButton;