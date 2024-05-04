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

export function NavbarItems(props: any){
  return(
    <>
      <div className = {styles.detailsContainer}>
        <h2>BCRA <br />DASHBOARD</h2>
        Principales Variables
      </div>
      <div className={styles.botones}>
        <NavbarButton onClick={props.onClick} text="General" href="/" icon={<RiDashboard2Fill/>}/>
        <NavbarButton onClick={props.onClick} text="Reservas BCRA" href="/reserves" icon={<FaSackDollar/>}/>
        <NavbarButton onClick={props.onClick} text="Tipo de Cambio" href="/exchange-rate" icon = {<MdCurrencyExchange/>}/>
        <NavbarButton onClick={props.onClick} text="Tasas de Interés" href="/interest-rate" icon = {<AiOutlineStock/>}/>
        <NavbarButton onClick={props.onClick} text="Base Monetaria" href="/monetary-base" icon = {<RiPrinterFill/>}/>
        <NavbarButton onClick={props.onClick} text="Pases Pasivos" href="/reverse-repos" icon = {<GiReceiveMoney/>}/>
        <NavbarButton onClick={props.onClick} text="Depósitos" href="/deposits" icon = {<TbPigMoney/>}/>
        <NavbarButton onClick={props.onClick} text="Inflación" href="/inflation" icon = {<FaMoneyBillTrendUp/>}/>
        <NavbarButton onClick={props.onClick} text="Otros" href="/other" icon={<AiFillBank/>}/>
      </div>
    </>
  )
}

export default function Navbar(){
  const [active, setActive] = useState(false);
  return (
    <>
      <div className={styles.navbarWeb}>
        <NavbarItems/>        
      </div>
      <div className={styles.navbarMobile}>
        <IoMdMenu style={{zIndex:"2"}} size={"1.4rem"} onClick={() => {setActive(!active)}}/>
      </div>
      <div className = {`${styles.itemsContainerMobile} ${active ? styles.active: ''}`}>
        <NavbarItems onClick={() => {setActive(false)}}/>    
      </div>
    </>
  )
}