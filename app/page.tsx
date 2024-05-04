import Image from "next/image";
import styles from "@/styles/home.module.css";
import { BsInfoCircle } from "react-icons/bs";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>Estadísticas Generales</h1>
      <div className={styles.cardsContainer}>
        <div className={`${styles.baseCard} ${styles.smallCard}`}>
          <h4>Reservas <br />Internacionales</h4>
          <div>
            <h3>$27,578</h3>
            <p>Millones de dólares</p>
          </div>
        </div>
        <div className={`${styles.baseCard} ${styles.mediumCard}`}>
          <h4>Tipo de Cambio</h4>
          <div style={{width:"100%", display: "flex", alignContent: "center", justifyContent: "space-around", padding:"0 1rem 0 1rem"}}>
            <div>
              <h3>$921.34</h3>
              <p>Minorista</p>  
            </div>
            <div>
              <h3>$878.75</h3>
              <p>Mayorista</p>
            </div>
          </div>
        </div>
        <div className={`${styles.baseCard} ${styles.smallCard}`}>
        <h4>Base Monetaria</h4>
          <div>
            <h3>$14,969,070</h3>
            <p>Millones de pesos</p>
          </div>
        </div>
        <div className={`${styles.baseCard} ${styles.smallCard}`}>
          <h4>Pases Pasivos <br />para el BCRA </h4>
          <div>
            <h3>$32,712,831</h3>
            <p>Millones de pesos</p>
          </div>
        </div>
        <div className={`${styles.baseCard} ${styles.mediumCard}`}>
          <h4>Tasa de Política Monetaria</h4>
          <div style={{width:"100%", display: "flex", alignContent: "center", justifyContent: "space-around", padding:"0 1rem 0 1rem"}}>
            <div>
              <h3>50%</h3>
              <p>TNA</p>  
            </div>
            <div>
              <h3>64.82%</h3>
              <p>TEA</p>
            </div>
          </div>
        </div>
        <div className={`${styles.baseCard} ${styles.mediumCard}`}>
          <h4>Tasa de Inflación</h4>
          <div style={{width:"100%", display: "flex", alignContent: "center", justifyContent: "space-around", padding:"0 1rem 0 1rem"}}>
            <div>
              <h3>11%</h3>
              <p>Mensual</p>  
            </div>
            <div>
              <h3>287.9%</h3>
              <p>Interanual</p>
            </div>
          </div>
        </div>
        <div className={`${styles.baseCard} ${styles.smallCard}`}>
          <h4>Depósitos en Efectivo en <br />las Entidades Financieras</h4>
          <div>
            <h3>$84,834,758</h3>
            <p>Millones de pesos</p>
          </div>
        </div>
        
        <div className={`${styles.baseCard} ${styles.smallCard}`}>
          <h4>Préstamos al sector privado<br />de las Entidades Financieras</h4>
          <div>
            <h3>$84,834,758</h3>
            <p>Millones de pesos</p>
          </div>
        </div>
        <div className={`${styles.baseCard} ${styles.smallCard}`}>
          <h4>Más Información</h4>
          <Link href="https://www.bcra.gob.ar/PublicacionesEstadisticas/Principales_variables.asp" target="_blank">
            <BsInfoCircle style={{margin:"0.2rem"}} size={"3rem"} />
          </Link>
          <p>Visita la página <br /> oficial del BCRA</p>
        </div>
        
      </div>
      
    </>
  );
}
