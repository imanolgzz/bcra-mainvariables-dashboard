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
const dateFormat2 = 'YYYY-MM';

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

export default function InflationRateClient({t}: any){
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [mensaje, setMensaje] = useState<string>("")
  const [dates,setDates] = useState<datesProps> ({
    startDate: '',
    endDate: ''
  })

  const [combinedInflationRateData, setcombinedInflationRateData] = useState<combinedQueryProps|undefined> (undefined)
  let monthlyInflation: queryProps|undefined = undefined;
  let annualInflation: queryProps|undefined = undefined;

  const fetchcombinedInflationRateData = async () => {
    if(monthlyInflation === undefined || annualInflation === undefined){
      setIsFetchingData(false);
      setMensaje(t.error);
      console.log(monthlyInflation)
      console.log(annualInflation)
      return;
    }
    setIsFetchingData(true);
    let body = [
      {
        dates: monthlyInflation.dates,
        values: monthlyInflation.values
      },
      {
        dates: annualInflation.dates,
        values: annualInflation.values
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
      setcombinedInflationRateData(data);
      setIsFetchingData(false);
    } else {
      setMensaje(t.notFound);
      setcombinedInflationRateData(undefined);
      setIsFetchingData(false);
    }
  }

  const fetchInflationRateData = async () => {
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
        idVariable: 27,
        startDate: dates.startDate,
        endDate: dayjs(dates.endDate).endOf('month').format('YYYY-MM-DD')
      }),
    }).then(response => response.json()).then(data => {
      if(data.error){
        setIsFetchingData(false);
        setMensaje(t.notFound);
        return;
      }
      monthlyInflation = data;
      const response2 = fetch('/api/variable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idVariable: 28,
          startDate: dates.startDate,
          endDate: dayjs(dates.endDate).endOf('month').format('YYYY-MM-DD')
        }),
      }).then(response => response.json()).then(data => {
        if(data.error){
          setIsFetchingData(false);
          setMensaje(t.notFound);
          return;
        }
        annualInflation = data;
        fetchcombinedInflationRateData();
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
    scales: {
      y: {
          beginAtZero: true
      }
    }
  };

  return(
    <>
      <h1>{t.title}</h1>
      <div className = {styles.generalContainer}>
        <p style={{textAlign:"center", paddingRight: "1rem", paddingLeft:"1rem"}}>{t.description}</p>
        <div style={{display:"flex", flexWrap:"nowrap", justifyContent:"center", alignItems:"center", gap:"1rem", padding:"0 0.8rem 0 0.8rem"}}>
          <InputCalendar
            type="month"
            onChange={(e) => {
              setDates({
                ...dates,
                startDate: e.target.value
              });
              console.log(dates.startDate);
            }}
            value={dates.startDate}
            //min="1944-01-01"
            //min = "1944-01"
            min = {dates.endDate === '' ? "1944-01" : dayjs(dates.endDate).subtract(11, 'month').format(dateFormat2)}
            max={dates.endDate === '' ? dayjs().format("YYYY-MM") : dates.endDate}
          />
          <InputCalendar
            type="month"
            onChange={(e) => {
              setDates({
                ...dates,
                endDate: e.target.value
              });
              console.log(dates.endDate);
            }}
            value={dates.endDate}
            min = {dates.startDate === '' ? "1944-01" : dates.startDate}
            //max={dayjs().format("YYYY-MM")}
            max = {dates.startDate === '' ? dayjs().format(dateFormat2) : dayjs(dates.startDate).add(11, 'month').format(dateFormat2)}
            
          />
        </div>
      </div>
      <div onClick={() => {fetchInflationRateData()}} className = {styles.searchButton}>
        {t.search}
      </div>
      {isFetchingData && <p>Cargando...</p>}
      {((combinedInflationRateData === undefined) && !isFetchingData) && <p>{mensaje}</p>}
      {(!isFetchingData && (combinedInflationRateData)) && (
        <div style={{width: "90%", height: "62%"}}>
          <Line 
            options={options}
            data={{
              labels: combinedInflationRateData?.dates,
              datasets: [
                {
                  label: t.graphLegends[0],
                  data: combinedInflationRateData?.values[0],
                  fill: false,
                  borderColor: 'rgb(0,0,255)',
                  borderWidth: 2,
                  pointRadius: 0
                },
                {
                  label: t.graphLegends[1],
                  data: combinedInflationRateData?.values[1],
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