import styles from '@/styles/navbar.module.css';
import NavbarButton from './navbarButton';
import { FaSackDollar } from 'react-icons/fa6';
import { MdCurrencyExchange } from 'react-icons/md';
import { FaMoneyBillTrendUp } from 'react-icons/fa6';
import { TbPigMoney } from 'react-icons/tb';
import { GiReceiveMoney } from 'react-icons/gi';
import { AiFillBank } from 'react-icons/ai';
import { RiPrinterFill } from 'react-icons/ri';
import { AiOutlineStock } from 'react-icons/ai';
import { RiDashboard2Fill } from 'react-icons/ri';


export default function Navbar(){
  return (
    <div className={styles.navbarWeb}>
      <div className={styles.botones}>
        <NavbarButton text="General" href="/" icon={<RiDashboard2Fill/>}/>
        <NavbarButton text="Reservas BCRA" href="/reserves" icon={<FaSackDollar/>}/>
        <NavbarButton text="Tipo de Cambio" href="/exchange-rate" icon = {<MdCurrencyExchange/>}/>
        <NavbarButton text="Tasas de Interés" href="/interest-rate" icon = {<AiOutlineStock/>}/>
        <NavbarButton text="Base Monetaria" href="/monetary-base" icon = {<RiPrinterFill/>}/>
        <NavbarButton text="Pases Pasivos" href="/reverse-repos" icon = {<GiReceiveMoney/>}/>
        <NavbarButton text="Depósitos" href="/deposits" icon = {<TbPigMoney/>}/>
        <NavbarButton text="Inflación" href="/inflation" icon = {<FaMoneyBillTrendUp/>}/>
        <NavbarButton text="Otros" href="/other" icon={<AiFillBank/>}/>
      </div>

    </div>
  )
}