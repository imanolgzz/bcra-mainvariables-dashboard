import styles from '@/styles/home/card.module.css'

interface cardProps{
  title: string,
  size: "small" | "medium" | "large",
  children?: React.ReactNode,
  //style is inline css style
  style?: React.CSSProperties
}

const Card = ({title, size, children, style}:cardProps) => {
  return (
    <div style={style} className={`${styles.baseCard} ${size==='medium' ? styles.mediumCard : ''} ${size==='small' ? styles.smallCard : ''} ${size==='large' ? styles.largeCard : ''}`}>
      <h4>{title}</h4>
      <div style={{width:"100%", display: "flex", alignContent: "center", justifyContent: "space-around", padding:"0 1rem 0 1rem"}}>
        {children}
      </div>
    </div>
  )
}

export default Card