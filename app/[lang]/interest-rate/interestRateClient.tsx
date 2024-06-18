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

export default function InterestRateClient({t}: any){
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [mensaje, setMensaje] = useState<string>("")
  const [dates,setDates] = useState<datesProps> ({
    startDate: '',
    endDate: ''
  })

  const [combinedExchangeRateData, setCombinedExchangeRateData] = useState<combinedQueryProps|undefined> (undefined)
  let retailExchangeRateData: queryProps|undefined = undefined;
  let wholesaleExchangeRateData: queryProps|undefined = undefined;

  const fetchCombinedExchangeRateData = async () => {
    if(retailExchangeRateData === undefined || wholesaleExchangeRateData === undefined){
      setIsFetchingData(false);
      setMensaje(t.error);
      console.log(retailExchangeRateData)
      console.log(wholesaleExchangeRateData)
      return;
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
      setMensaje(t.notFound);
      setCombinedExchangeRateData(undefined);
      setIsFetchingData(false);
    }
  }

  const fetchExchangeRateData = async () => {
    if(dates.startDate === '' || dates.endDate === ''){
      return
    }
    console.log("started fetching data")
    setIsFetchingData(true)
    const response = await fetch('/api/variable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idVariable: 6,
        startDate: dates.startDate,
        endDate: dates.endDate
      }),
    }).then(response => response.json()).then(data => {
      console.log("Data from retail exchange rate received ", data);
      retailExchangeRateData = data;
      const response2 = fetch('/api/variable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idVariable: 34,
          startDate: dates.startDate,
          endDate: dates.endDate
        }),
      }).then(response => response.json()).then(data => {
        console.log("Data from wholesale exchange rate received ", data);
        wholesaleExchangeRateData = data;
        fetchCombinedExchangeRateData();
      }).catch(error => {
        console.error('Error:', error);
        setIsFetchingData(false);
        setMensaje(t.error);
      });

  }).catch(error => {
      console.error('Error:', error);
      setIsFetchingData(false);
      setMensaje(t.error);
  })
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
      <h1>{t.title}</h1>
      <div className = {styles.generalContainer}>
        <p style={{textAlign:"center", paddingRight: "1rem", paddingLeft:"1rem"}}>{t.description}</p>
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
            //min="2020-01-23"
            min = {dates.endDate === '' ? "2020-01-23" : dayjs(dates.endDate).subtract(365, 'day').format(dateFormat)}
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
            min = {dates.startDate === '' ? "2020-01-23" : dates.startDate}
            //max={dayjs().format(dateFormat)}
            max = {dates.startDate === '' ? dayjs().format(dateFormat) : dayjs(dates.startDate).add(365, 'day').format(dateFormat)}
          />
        </div>
      </div>
      <div onClick={() => {fetchExchangeRateData()}} className = {styles.searchButton}>
        {t.search}
      </div>
      {isFetchingData && <p>{t.loading}</p>}
      {((combinedExchangeRateData === undefined) && !isFetchingData) && <p>{mensaje}</p>}
      {(!isFetchingData && (combinedExchangeRateData)) && (
        <div style={{width: "90%", height: "62%"}}>
          <Line 
            options={options}
            data={{
              labels: combinedExchangeRateData?.dates,
              datasets: [
                {
                  label: t.graphLegends[0],
                  data: combinedExchangeRateData?.values[0],
                  fill: false,
                  borderColor: 'rgb(0,0,0)',
                  borderWidth: 2,
                  pointRadius: 0
                },
                {
                  label: t.graphLegends[1],
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