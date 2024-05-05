'use client';
import Image from "next/image";
import styles from "@/styles/home.module.css";
import { BsInfoCircle } from "react-icons/bs";
import Link from "next/link";
import { useEffect, useState } from "react";

interface generalProps {
  internationalReserves: any,
  retailExchangeRate: any,
  wholesaleExchangeRate: any,
  TNA: any,
  TEA: any,
  monetaryBase: any,
  depositsInFinancialEntities: any,
  loansToPrivateSector: any,
  monthlyInflation: any,
  annualInflation: any,
  reserveRepos: any
}

export default function Home() {

  const [isFetchingData, setIsFetchingData] = useState(true)
  const [generalData, setGeneralData] = useState<generalProps | undefined>(undefined);

  useEffect(() => {
    fetchGeneralData()
  }, [])

  const fetchGeneralData = async () => {
    setIsFetchingData(true)
    const response = await fetch('/api/general', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
    const data = await response.json()
    if(response.status === 200){
      setGeneralData(data)
      setIsFetchingData(false)
    }
  }

  return (
    <>
      <h1>Estadísticas Generales</h1>
      {isFetchingData && <p>Cargando...</p>}
      {!isFetchingData && (
        <div className={styles.cardsContainer}>
          <div className={`${styles.baseCard} ${styles.smallCard}`}>
            <h4>Reservas Internacionales</h4>
            <div>
              <h3>${generalData?.internationalReserves.value}</h3>
              <p>Millones de dólares</p>
            </div>
          </div>
          <div className={`${styles.baseCard} ${styles.mediumCard}`}>
            <h4>Tipo de Cambio</h4>
            <div style={{width:"100%", display: "flex", alignContent: "center", justifyContent: "space-around", padding:"0 1rem 0 1rem"}}>
              <div>
                <h3>${generalData?.retailExchangeRate.value}</h3>
                <p>Minorista</p>  
              </div>
              <div>
                <h3>${generalData?.wholesaleExchangeRate.value}</h3>
                <p>Mayorista</p>
              </div>
            </div>
          </div>
          <div className={`${styles.baseCard} ${styles.smallCard}`}>
          <h4>Base Monetaria</h4>
            <div>
              <h3>${generalData?.monetaryBase.value}</h3>
              <p>Millones de pesos</p>
            </div>
          </div>
          <div className={`${styles.baseCard} ${styles.smallCard}`}>
            <h4>Pases Pasivos para el BCRA </h4>
            <div>
              <h3>${generalData?.reserveRepos.value}</h3>
              <p>Millones de pesos</p>
            </div>
          </div>
          <div className={`${styles.baseCard} ${styles.mediumCard}`}>
            <h4>Tasa de Política Monetaria</h4>
            <div style={{width:"100%", display: "flex", alignContent: "center", justifyContent: "space-around", padding:"0 1rem 0 1rem"}}>
              <div>
                <h3>{generalData?.TNA.value}%</h3>
                <p>TNA</p>  
              </div>
              <div>
                <h3>{generalData?.TEA.value}%</h3>
                <p>TEA</p>
              </div>
            </div>
          </div>
          <div className={`${styles.baseCard} ${styles.mediumCard}`}>
            <h4>Tasa de Inflación</h4>
            <div style={{width:"100%", display: "flex", alignContent: "center", justifyContent: "space-around", padding:"0 1rem 0 1rem"}}>
              <div>
                <h3>{generalData?.monthlyInflation.value}%</h3>
                <p>Mensual</p>  
              </div>
              <div>
                <h3>{generalData?.annualInflation.value}%</h3>
                <p>Interanual</p>
              </div>
            </div>
          </div>
          <div className={`${styles.baseCard} ${styles.smallCard}`}>
            <h4>Depósitos en Efectivo en las Entidades Financieras</h4>
            <div>
              <h3>${generalData?.depositsInFinancialEntities.value}</h3>
              <p>Millones de pesos</p>
            </div>
          </div>
          
          <div className={`${styles.baseCard} ${styles.smallCard}`}>
            <h4>Préstamos al Sector Privado de las Entidades Financieras</h4>
            <div>
              <h3>${generalData?.loansToPrivateSector.value}</h3>
              <p>Millones de pesos</p>
            </div>
          </div>
          <div style={{marginBottom:"1.5rem"}} className={`${styles.baseCard} ${styles.smallCard}`}>
            <h4>Más Información</h4>
            <Link href="https://www.bcra.gob.ar/PublicacionesEstadisticas/Principales_variables.asp" target="_blank">
              <BsInfoCircle style={{margin:"0.2rem"}} size={"3rem"} />
            </Link>
            <p style={{paddingLeft:"1rem", paddingRight: "1rem"}}>Visita la página oficial del BCRA</p>
          </div>
        </div>
      )
      }
      
      
    </>
  );
}
