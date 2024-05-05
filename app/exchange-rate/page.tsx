'use client';
import styles from '@/styles/reserves.module.css';
import InputCalendar from '@/components/inputCalendar';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

dayjs.extend(customParseFormat);

const dateFormat = 'YYYY-MM-DD';

interface datesProps {
  startDate: string,
  endDate: string
}

interface queryProps {
  dates: string[],
  values: number[]
}

interface combinedQueryProps {
  dates: string[],
  values: number[][]
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Reserves(){
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [mensaje, setMensaje] = useState<string>("")
  const [dates,setDates] = useState<datesProps> ({
    startDate: '',
    endDate: ''
  })

  const [retailExchangeRateData, setRetailExchangeRateData] = useState<queryProps|undefined> (undefined)
  const [wholesaleExchangeRateData, setWholesaleExchangeRateData] = useState<queryProps|undefined> (undefined)
  const [combinedExchangeRateData, setCombinedExchangeRateData] = useState<combinedQueryProps|undefined> (undefined)

  const fetchCombinedExchangeRateData = async () => {
    if(retailExchangeRateData === undefined || wholesaleExchangeRateData === undefined){
      setIsFetchingData(false);
      setMensaje("Problema al combinar datos");
      return
    }
    setIsFetchingData(true);
    let body = [
      {
        dates: retailExchangeRateData.dates,
        values: retailExchangeRateData.values
      },
      {
        dates: wholesaleExchangeRateData.dates,
        values: wholesaleExchangeRateData.values
      }
    ]

    const response = await fetch('/api/combineGraphs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if(response.status === 200){
      setCombinedExchangeRateData(data);
      setIsFetchingData(false);
    } else {
      setMensaje(data.error);
      setCombinedExchangeRateData(undefined);
      setIsFetchingData(false);
    }
  }

  const fetchExchangeRateData = async () => {
    if(dates.startDate === '' || dates.endDate === ''){
      return
    }
    setIsFetchingData(true)
    const response = await fetch('/api/variable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idVariable: 4,
        startDate: dates.startDate,
        endDate: dates.endDate
      }),
    })
    const data = await response.json()
    if(response.status === 200){
      setRetailExchangeRateData(data);
      const response2 = await fetch('/api/variable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idVariable: 5,
          startDate: dates.startDate,
          endDate: dates.endDate
        }),
      })
      const data2 = await response2.json()
      if(response2.status === 200){
        setWholesaleExchangeRateData(data2);
        await fetchCombinedExchangeRateData();
      } else {
        setMensaje(data2.error);
        setWholesaleExchangeRateData(undefined);
        setIsFetchingData(false);
      }
    } else {
      setMensaje(data.error);
      setRetailExchangeRateData(undefined);
      setIsFetchingData(false);
      return;
    }


  }

  const options = {
    maintainAspectRatio: false, // Add this line
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return(
    <>
      <h1>Tipo de cambio</h1>
      <div className = {styles.generalContainer}>
        <p style={{textAlign:"center", paddingRight: "1rem", paddingLeft:"1rem"}}>Seleccione un rango de fechas para ver la evolución del tipo de cambio oficial</p>
        <div style={{display:"flex", flexWrap:"nowrap", justifyContent:"center", alignItems:"center", gap:"1rem", padding:"0 0.8rem 0 0.8rem"}}>
          <InputCalendar
            onChange={(e) => {
              setDates({
                ...dates,
                startDate: e.target.value
              });
              console.log(dates.startDate);
            }}
            value={dates.startDate}
            min="1996-01-02"
            max={dates.endDate === '' ? dayjs().format(dateFormat) : dates.endDate}
          />
          <InputCalendar
            onChange={(e) => {
              setDates({
                ...dates,
                endDate: e.target.value
              });
              console.log(dates.endDate);
            }}
            value={dates.endDate}
            min = {dates.startDate === '' ? "1996-01-02" : dates.startDate}
            max={dayjs().format(dateFormat)}
          />
        </div>
      </div>
      <div onClick={() => {fetchExchangeRateData()}} className = {styles.searchButton}>
        Buscar
      </div>
      {isFetchingData && <p>Cargando...</p>}
      {(((retailExchangeRateData === undefined) || (wholesaleExchangeRateData === undefined)) && !isFetchingData) && <p>{mensaje}</p>}
      {(!isFetchingData && (combinedExchangeRateData)) && (
        <div style={{width: "90%", height: "62%"}}>
          <Line 
            options={options}
            data={{
              labels: combinedExchangeRateData?.dates,
              datasets: [
                {
                  label: 'Tipo de cambio Minorista',
                  data: combinedExchangeRateData?.values[0],
                  fill: false,
                  borderColor: 'rgb(0,0,0)',
                  borderWidth: 2,
                  pointRadius: 0
                },
                {
                  label: 'Tipo de cambio Mayorista',
                  data: combinedExchangeRateData?.values[1],
                  fill: false,
                  borderColor: 'rgb(255,0,0)',
                  borderWidth: 2,
                  pointRadius: 0
                }
              ]
            }}
          />
        </div>
      )}
    </>
  )
}