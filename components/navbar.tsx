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


export default function Navbar(){
  return (
    <div className={styles.navbarWeb}>
      <div className={styles.botones}>
        <NavbarButton text="Reservas BCRA" href="/" icon={<FaSackDollar/>}/>
        <NavbarButton text="Tipo de Cambio" href="/about" icon = {<MdCurrencyExchange/>}/>
        <NavbarButton text="Tasas de Interés" href="/contact" icon = {<AiOutlineStock/>}/>
        <NavbarButton text="Base Monetaria" href="/contact" icon = {<RiPrinterFill/>}/>
        <NavbarButton text="Pases Pasivos" href="/contact" icon = {<GiReceiveMoney/>}/>
        <NavbarButton text="Depósitos" href="/contact" icon = {<TbPigMoney/>}/>
        <NavbarButton text="Inflación" href="/contact" icon = {<FaMoneyBillTrendUp/>}/>
        <NavbarButton text="Otros" href="/contact" icon={<AiFillBank/>}/>
      </div>

    </div>
  )
}