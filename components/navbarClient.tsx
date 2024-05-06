'use client';
import styles from '@/styles/navbar.module.css';
import NavbarButton from './navbarButton';
import { useState } from 'react';
import { FaSackDollar, FaMoneyBillTrendUp } from 'react-icons/fa6';
import { AiFillBank, AiOutlineStock } from 'react-icons/ai';
import { RiPrinterFill, RiDashboard2Fill } from 'react-icons/ri';
import { MdCurrencyExchange } from 'react-icons/md';
import { TbPigMoney } from 'react-icons/tb';
import { GiReceiveMoney } from 'react-icons/gi';
import { IoMdMenu } from 'react-icons/io';
import { FaInfoCircle } from 'react-icons/fa';
import Image from 'next/image';
import argentineFlag from '@/public/ar.png'
import usaFlag from '@/public/usa.png'
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface NavbarItemsProps{

  onClick?: () => void,
  t?: any
}

export function NavbarItems({onClick, t} : NavbarItemsProps){
  const params = useParams();

  return(
    <>
      <div className = {styles.detailsContainer}>
        <h2>BCRA <br />DASHBOARD</h2>
        {t.mainVariables}<br />
        <div className = {styles.languageContainer}>
          
          <Link onClick={() => {console.log(params)}} href="/es" >
            <div style={{display:"flex", gap:"0.4rem"}}>
              <Image src={argentineFlag.src} alt='AR' width={30} height={30}/>
              <b className={`${params.lang==="es" ? styles.langActive : ''}`}>ES</b>
            </div>
          </Link>
          <Link href="/en">
            <div onClick={() => {console.log(params)}} style={{display:"flex", gap:"0.4rem"}}>
            <Image src={usaFlag.src} alt='USA' width={30} height={30}/>
              <b className={`${params.lang==="en" ? styles.langActive : ''}`}>EN</b>
            </div>
          </Link>
          
        </div>
      </div>
      <div className={styles.botones}>
        <NavbarButton onClick={onClick} text={t.home} href={"/" + params.lang + "/"} icon={<RiDashboard2Fill/>}/>
        <NavbarButton onClick={onClick} text={t.reserves} href={"/" + params.lang + "/reserves"} icon={<FaSackDollar/>}/>
        <NavbarButton onClick={onClick} text={t.exchangeRate} href={"/" + params.lang + "/exchange-rate"} icon = {<MdCurrencyExchange/>}/>
        <NavbarButton onClick={onClick} text={t.interestRates} href={"/" + params.lang + "/interest-rate"} icon = {<AiOutlineStock/>}/>
        <NavbarButton onClick={onClick} text={t.monetaryBase} href={"/" + params.lang + "/monetary-base"} icon = {<RiPrinterFill/>}/>
        <NavbarButton onClick={onClick} text={t.reverseRepos} href={"/" + params.lang + "/reverse-repos"} icon = {<GiReceiveMoney/>}/>
        <NavbarButton onClick={onClick} text={t.inflation} href={"/" + params.lang + "/inflation"} icon = {<FaMoneyBillTrendUp/>}/>
        <NavbarButton onClick={onClick} text={t.about} href={"/" + params.lang + "/about"} icon = {<FaInfoCircle/>}/>
        {/* 
        <NavbarButton onClick={onClick} text="Depósitos" href="/deposits" icon = {<TbPigMoney/>}/>
        <NavbarButton onClick={onClick} text="Otros" href="/other" icon={<AiFillBank/>}/>
        */}
      </div>
    </>
  )
}

export default function NavbarClient({t, path} : any){
  const [active, setActive] = useState(false);
  return (
    <>
      <div className={styles.navbarWeb}>
        <NavbarItems t={t}/>        
      </div>
      <div className={styles.navbarMobile}>
        <IoMdMenu style={{zIndex:"2"}} size={"1.4rem"} onClick={() => {setActive(!active)}}/>
      </div>
      <div className = {`${styles.itemsContainerMobile} ${active ? styles.active: ''}`}>
        <NavbarItems t={t} onClick={() => {setActive(false)}}/>    
      </div>
    </>
  )
}