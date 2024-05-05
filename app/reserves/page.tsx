'use client';
import DatePicker from "antd/es/date-picker"
import type { DatePickerProps } from 'antd/es/date-picker/index';

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
  const [mensaje, setMensaje] = useState<string>("Ingrese valores para visualizar la gráfica")
  const [dates,setDates] = useState<datesProps> ({
    startDate: '',
    endDate: ''
  })

  const [reservesData, setReservesData] = useState<reservesProps|undefined> (undefined)

  const handleStartDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    setDates({
      startDate: dateString.toString(),
      endDate: dates.endDate
    })
  };

  const handleEndDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    setDates({
      startDate: dates.startDate,
      endDate: dateString.toString()
    })
  };

  const fetchReservesData = async () => {
    if(dates.startDate === '' || dates.endDate === ''){
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
    } else {
      setMensaje(data.error);
      setReservesData(undefined);
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
        {/* 
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
        */}
        <div style={{display:"flex", flexWrap:"wrap", justifyContent:"center", alignItems:"center", gap:"0.5rem", padding:"0 0.8rem 0 0.8rem"}}>
        <DatePicker
            onChange={handleStartDateChange}
            size="middle"
            picker="date"
            placement="bottomRight"
            format={dateFormat}
            placeholder="Fecha de inicio"
            minDate={dayjs('1996-01-02', dateFormat)}
            //maxDate={dayjs(dates.endDate,dateFormat)}
            //maxDate es la fecha fin o la fecha actual, la que sea menor
            maxDate={dayjs(dates.endDate,dateFormat) < dayjs() ? dayjs(dates.endDate,dateFormat) : dayjs()}
          />
          <DatePicker
            onChange={handleEndDateChange}
            size="middle"
            picker="date"
            placement="bottomLeft"
            format={dateFormat}
            placeholder="Fecha de fin"
            //minDate={dayjs(dates.startDate,dateFormat)}
            minDate={dayjs(dates.startDate,dateFormat) > dayjs('1996-01-02', dateFormat) ? dayjs(dates.startDate,dateFormat) : dayjs('1996-01-02', dateFormat)}
            maxDate={dayjs()}
          />
        </div>
        
        
        
      </div>
      <div onClick={() => {fetchReservesData()}} className = {styles.searchButton}>
        Buscar
      </div>
      {isFetchingData && <p>Cargando...</p>}
      {((reservesData === undefined) && !isFetchingData) && <p>{mensaje}</p>}
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