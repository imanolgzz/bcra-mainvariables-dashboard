'use client';
import styles from "@/styles/home/home.module.css";
import { BsInfoCircle } from "react-icons/bs";
import Link from "next/link";
import { useEffect, useState } from "react";
import Card from "@/components/home/card";

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

export default function HomeClient({t}: any) {
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
      <h1>{t.title}</h1>
      {isFetchingData && <p>{t.loading}</p>}
      {!isFetchingData && (
        <div className={styles.cardsContainer}>
          <Card size="small" title={t.internationalReserves}>
            <div> <h3>${generalData?.internationalReserves.value}</h3> <p>{t.millionsOfDollars}</p> </div>
          </Card>
          <Card size="medium" title={t.exchangeRate}>
            <div> <h3>${generalData?.retailExchangeRate.value}</h3> <p>{t.retail}</p> </div>
            <div> <h3>${generalData?.wholesaleExchangeRate.value}</h3> <p>{t.wholesale}</p> </div>
          </Card>
          <Card size="small" title={t.monetaryBase}>
            <div> <h3>${generalData?.monetaryBase.value}</h3> <p>{t.millionsOfPesos}</p> </div>
          </Card>
          <Card size="small" title={t.reverseRepos}>
            <div> <h3>${generalData?.reserveRepos.value}</h3> <p>{t.millionsOfPesos}</p> </div>
          </Card>
          <Card size="medium" title={t.monetaryPolicyRate}>
            <div> <h3>{generalData?.TNA.value}%</h3> <p>{t.TNA}</p> </div>
            <div> <h3>{generalData?.TEA.value}%</h3> <p>{t.TEA}</p> </div>
          </Card>
          <Card size="medium" title={t.inflationRate}>
            <div> <h3>{generalData?.monthlyInflation.value}%</h3> <p>{t.Monthly}</p> </div>
            <div> <h3>{generalData?.annualInflation.value}%</h3> <p>{t.YearOnYear}</p> </div>
          </Card>
          <Card size="small" title={t.cashDeposits}>
            <div> <h3>${generalData?.depositsInFinancialEntities.value}</h3> <p>{t.millionsOfPesos}</p> </div>
          </Card>
          <Card size="small" title={t.privateDebts}>
            <div> <h3>${generalData?.loansToPrivateSector.value}</h3> <p>{t.millionsOfPesos}</p> </div>
          </Card>
          <Card size="small" title={t.moreInformation}>
            <div className={styles.moreInfo}>
              <Link href={t.BCRALink} target="_blank">
                <BsInfoCircle style={{margin:"0.2rem"}} size={"3rem"} />
              </Link>
              <p style={{paddingLeft:"1rem", paddingRight: "1rem"}}>{t.about}</p>
            </div>
          </Card>
        </div>
      )
      }
    </>
  );
}
