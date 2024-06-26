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
  // two arrays, one with the dates and the other with the values
  dates: string[],
  values: number[]
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

export default function ReverseReposClient({t}: any){
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [mensaje, setMensaje] = useState<string>("")
  const [dates,setDates] = useState<datesProps> ({
    startDate: '',
    endDate: ''
  })

  const [reverseReposData, setreverseReposData] = useState<queryProps|undefined> (undefined)

  const fetchreverseReposData = async () => {
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
        idVariable: 42,
        startDate: dates.startDate,
        endDate: dates.endDate
      }),
    })
    const data = await response.json()
    if(response.status === 200){
      setreverseReposData(data);
      console.log(reverseReposData);
      setIsFetchingData(false);
    } else {
      setMensaje(t.notFound);
      setreverseReposData(undefined);
      setIsFetchingData(false);
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
            //min="1996-01-02"
            min = {dates.endDate === '' ? "1996-01-02" : dayjs(dates.endDate).subtract(365, 'day').format(dateFormat)}
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
            //max={dayjs().format(dateFormat)}
            max = {dates.startDate === '' ? dayjs().format(dateFormat) : dayjs(dates.startDate).add(365, 'day').format(dateFormat)}
          />
        </div>
      </div>
      <div onClick={() => {fetchreverseReposData()}} className = {styles.searchButton}>
        {t.search}
      </div>
      {isFetchingData && <p>{t.loading}</p>}
      {((reverseReposData === undefined) && !isFetchingData) && <p>{mensaje}</p>}
      {(!isFetchingData && reverseReposData) && (
        <div style={{width: "90%", height: "62%"}}>
          <Line 
            options={options}
            data={{
              labels: reverseReposData?.dates,
              datasets: [
                {
                  label: t.graphLegends[0],
                  data: reverseReposData?.values,
                  fill: false,
                  borderColor: 'rgb(0,0,0)',
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