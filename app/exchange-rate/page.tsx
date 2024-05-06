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

  const [combinedInterestRateData, setcombinedInterestRateData] = useState<combinedQueryProps|undefined> (undefined)
  let tnaData: queryProps|undefined = undefined;
  let teaData: queryProps|undefined = undefined;

  const fetchcombinedInterestRateData = async () => {
    if(tnaData === undefined || teaData === undefined){
      setIsFetchingData(false);
      setMensaje("Error al mostrar las gráficas");
      console.log(tnaData)
      console.log(teaData)
      return;
    }
    setIsFetchingData(true);
    let body = [
      {
        dates: tnaData.dates,
        values: tnaData.values
      },
      {
        dates: teaData.dates,
        values: teaData.values
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
      setcombinedInterestRateData(data);
      setIsFetchingData(false);
    } else {
      setMensaje(data.error);
      setcombinedInterestRateData(undefined);
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
        idVariable: 4,
        startDate: dates.startDate,
        endDate: dates.endDate
      }),
    }).then(response => response.json()).then(data => {
      console.log("Data from retail exchange rate received ", data);
      tnaData = data;
      const response2 = fetch('/api/variable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idVariable: 5,
          startDate: dates.startDate,
          endDate: dates.endDate
        }),
      }).then(response => response.json()).then(data => {
        console.log("Data from wholesale exchange rate received ", data);
        teaData = data;
        fetchcombinedInterestRateData();
      }).catch(error => {
        console.error('Error:', error);
        setIsFetchingData(false);
        setMensaje("Error al obtener los datos");
      });

  }).catch(error => {
      console.error('Error:', error);
      setIsFetchingData(false);
      setMensaje("Error al obtener los datos");
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
            min="2010-06-01"
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
            min = {dates.startDate === '' ? "2010-06-01" : dates.startDate}
            max={dayjs().format(dateFormat)}
          />
        </div>
      </div>
      <div onClick={() => {fetchExchangeRateData()}} className = {styles.searchButton}>
        Buscar
      </div>
      {isFetchingData && <p>Cargando...</p>}
      {((combinedInterestRateData === undefined) && !isFetchingData) && <p>{mensaje}</p>}
      {(!isFetchingData && (combinedInterestRateData)) && (
        <div style={{width: "90%", height: "62%"}}>
          <Line 
            options={options}
            data={{
              labels: combinedInterestRateData?.dates,
              datasets: [
                {
                  label: 'Tipo de cambio Minorista',
                  data: combinedInterestRateData?.values[0],
                  fill: false,
                  borderColor: 'rgb(0,0,0)',
                  borderWidth: 2,
                  pointRadius: 0
                },
                {
                  label: 'Tipo de cambio Mayorista',
                  data: combinedInterestRateData?.values[1],
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