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

export default function Reserves(){
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [mensaje, setMensaje] = useState<string>("")
  const [dates,setDates] = useState<datesProps> ({
    startDate: '',
    endDate: ''
  })

  const [monetaryBaseData, setmonetaryBaseData] = useState<queryProps|undefined> (undefined)

  const fetchmonetaryBaseData = async () => {
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
        idVariable: 15,
        startDate: dates.startDate,
        endDate: dates.endDate
      }),
    })
    const data = await response.json()
    if(response.status === 200){
      setmonetaryBaseData(data);
      console.log(monetaryBaseData);
      setIsFetchingData(false);
    } else {
      setMensaje(data.error);
      setmonetaryBaseData(undefined);
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
      <h1>Base Monetaria</h1>
      <div className = {styles.generalContainer}>
        <p style={{textAlign:"center", paddingRight: "1rem", paddingLeft:"1rem"}}>Seleccione un rango de fechas para ver la evolución de la base monetaria nominal (en millones de pesos).</p>
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
      <div onClick={() => {fetchmonetaryBaseData()}} className = {styles.searchButton}>
        Buscar
      </div>
      {isFetchingData && <p>Cargando...</p>}
      {((monetaryBaseData === undefined) && !isFetchingData) && <p>{mensaje}</p>}
      {(!isFetchingData && monetaryBaseData) && (
        <div style={{width: "90%", height: "62%"}}>
          <Line 
            options={options}
            data={{
              labels: monetaryBaseData?.dates,
              datasets: [
                {
                  label: 'Base Monetaria Nominal (en millones de pesos)',
                  data: monetaryBaseData?.values,
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