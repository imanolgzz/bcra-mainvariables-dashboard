'use client';
import styles from '@/styles/reserves.module.css';
import InputCalendar from '@/components/inputCalendar';
import { Dropdown } from "antd";
import { MenuProps } from "antd";
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
import { TbDatabaseSmile } from 'react-icons/tb';

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

export default function MonetaryBaseClient({t}: any){
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [mensaje, setMensaje] = useState<string>("")
  const [dates,setDates] = useState<datesProps> ({
    startDate: '',
    endDate: ''
  })

  const [monetaryBaseData, setmonetaryBaseData] = useState<queryProps|undefined> (undefined)
  const [broadMonetaryBaseData, setBroadMonetaryBaseData] = useState<queryProps|undefined> (undefined)
  const [searchType, setSearchType] = useState<string>(t.monetaryBase);
  const [combinedMonetaryBaseData, setCombinedInterestRateData] = useState<combinedQueryProps|undefined> (undefined)
  let monetaryBaseDataAux: queryProps|undefined = undefined;
  let reverseReposDataAux: queryProps|undefined = undefined;
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div style={{width:"100%", textAlign:"center"}} onClick = {() => {setSearchType(t.monetaryBase);}}>
          {t.monetaryBase}
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div style={{width: "100%", textAlign: "center"}} onClick = {() => {setSearchType(t.broadMonetaryBase);}}>
          {t.broadMonetaryBase} 
        </div>
      ),
    },
  ];

  const fetchmonetaryBaseData = async () => {
    if(dates.startDate === '' || dates.endDate === ''){
      return
    }
    setIsFetchingData(true)
    if(searchType === t.monetaryBase){
      await fetchOnlyMonetaryBase();
    } else {
      await fetchBroadMonetaryBase(); 
    }
  }

  const getBroadMonetaryBase = async () => {
    if(monetaryBaseDataAux === undefined || reverseReposDataAux === undefined){
      setIsFetchingData(false);
      setMensaje(t.error);
      return;
    }
    setIsFetchingData(true);
    let body = [
      {
        dates: monetaryBaseDataAux.dates,
        values: monetaryBaseDataAux.values
      },
      {
        dates: reverseReposDataAux.dates,
        values: reverseReposDataAux.values
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
      setCombinedInterestRateData(data);
      // here we are going to sum each value with the other
      let finalBroadMonetaryBase: queryProps|undefined = undefined;
      
        let dates: string[] = data.dates;
        let values: number[] = [];
        for(let i = 0; i <data.values[0].length; i++){
          values.push(data.values[0][i] + data.values[1][i]);
        }
        finalBroadMonetaryBase = {
          dates: dates,
          values: values
        }
        setBroadMonetaryBaseData(finalBroadMonetaryBase);

      setIsFetchingData(false);
    } else {
      setMensaje(t.notFound);
      setIsFetchingData(false);
    }
  }

  const fetchOnlyMonetaryBase = async () =>{
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
      setMensaje(t.notFound);
      setmonetaryBaseData(undefined);
      setIsFetchingData(false);
    }
  }

  const fetchBroadMonetaryBase = async () => {
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
    }).then(response => response.json()).then(data => {
      if(data.error){
        setIsFetchingData(false);
        setMensaje(t.notFound);
        return;
      }
      monetaryBaseDataAux = data;
      const response2 = fetch('/api/variable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idVariable: 42,
          startDate: dates.startDate,
          endDate: dates.endDate
        }),
      }).then(response => response.json()).then(data => {
        if(data.error){
          setIsFetchingData(false);
          setMensaje(t.notFound);
          return;
        }
        console.log("Data from wholesale exchange rate received ", data);
        reverseReposDataAux = data;
        getBroadMonetaryBase();
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
        <Dropdown menu={{items}} placement = "bottom">
          <div className = {styles.dropdownButton}>
            {searchType} <span style={{position:"absolute", right: "0.5rem"}}>▼</span>
          </div> 
        </Dropdown>
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
      <div onClick={() => {fetchmonetaryBaseData()}} className = {styles.searchButton}>
        {t.search}
      </div>
      {isFetchingData && <p>{t.loading}</p>}
      {((monetaryBaseData === undefined && searchType === t.monetaryBase) && !isFetchingData) && <p>{mensaje}</p>}
      {(((broadMonetaryBaseData === undefined || combinedMonetaryBaseData === undefined) && (searchType === t.broadMonetaryBase)) && !isFetchingData) && <p>{mensaje}</p>}
      {((!isFetchingData && monetaryBaseData) && searchType === t.monetaryBase) && (
        <div style={{width: "90%", height: "62%"}}>
          <Line 
            options={options}
            data={{
              labels: monetaryBaseData?.dates,
              datasets: [
                {
                  label: t.graphLegends[0],
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
      {((!isFetchingData && (broadMonetaryBaseData && combinedMonetaryBaseData)) && searchType === t.broadMonetaryBase) && (
        <div style={{width: "90%", height: "62%"}}>
          <Line 
            options={options}
            data={{
              labels: broadMonetaryBaseData?.dates,
              datasets: [
                {
                  label: t.graphLegends[1],
                  data: broadMonetaryBaseData?.values,
                  fill: false,
                  borderColor: 'rgb(0,0,0)',
                  borderWidth: 2,
                  pointRadius: 0
                },
                {
                  label: t.graphLegends[2],
                  data: combinedMonetaryBaseData?.values[0],
                  fill: false,
                  borderColor: 'rgb(255,0,0)',
                  borderWidth: 2,
                  pointRadius: 0
                },
                {
                  label: t.graphLegends[3],
                  data: combinedMonetaryBaseData?.values[1],
                  fill: false,
                  borderColor: 'rgb(0,0,255)',
                  borderWidth: 2,
                  pointRadius: 0
                },
              ]
            }}
          />
        </div>
      )}
    </>
  )
}