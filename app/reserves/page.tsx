'use client';
import { DatePicker } from "antd";
import styles from '@/styles/reserves.module.css';
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

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';

interface datesProps {
  startDate: string,
  endDate: string
}

interface reservesProps {
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
  const [dates,setDates] = useState<datesProps|undefined> (undefined)
  const [reservesData, setReservesData] = useState<reservesProps|undefined> (undefined)

  const fetchReservesData = async () => {
    if(dates === undefined){
      return
    }
    setIsFetchingData(true)
    const response = await fetch('/api/reserves', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: dates.startDate,
        endDate: dates.endDate
      }),
    })
    const data = await response.json()
    if(response.status === 200){
      setReservesData(data);
      console.log(reservesData);
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
      <h1>Reservas Internacionales</h1>
      <div className = {styles.generalContainer}>
        <p style={{textAlign:"center", paddingRight: "1rem", paddingLeft:"1rem"}}>Seleccione un rango de fechas para ver la evolución de las reservas internacionales (en millones de dólares).</p>
        <RangePicker
          onChange={(dates, dateStrings) => {
            setDates({
              startDate: dateStrings[0],
              endDate: dateStrings[1]
            })
          }}
          size="large"
          picker="date"
          placement="bottomRight"
          minDate={dayjs('1996-01-02', dateFormat)}
          maxDate={dayjs()}
        />
        
      </div>
      <div onClick={() => {fetchReservesData()}} className = {styles.searchButton}>
        Buscar
      </div>
      {isFetchingData && <p>Cargando...</p>}
      {(!isFetchingData && reservesData) && (
        <div style={{width: "90%", height: "62%"}}>
          <Line 
            options={options}
            data={{
              labels: reservesData?.dates,
              datasets: [
                {
                  label: 'Reservas Internacionales BCRA',
                  data: reservesData?.values,
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