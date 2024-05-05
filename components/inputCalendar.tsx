interface inputProps {
  // on change event is a function is going to use useState
  onChange: (e: any) => void
  value: any
  min: any
  max: any
}

const InputCalendar = ({onChange, value, min, max}:inputProps) => {
  return (
    <input
      type="date"
      onChange={onChange}
      value={value}
      style={{width:"9rem", height:"2rem", borderRadius:"3px", textAlign:"center", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'", paddingRight: "0.5rem", fontSize:"1rem"}}
      min = {min}
      max = {max}
    />
  )
}

export default InputCalendar