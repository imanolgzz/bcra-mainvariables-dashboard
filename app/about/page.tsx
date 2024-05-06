export default function About(){
  return (
    <>
      <h1>Acerca de</h1>
      <div style={{width: "90%", display: "flex", flexDirection:"column", justifyContent:"center", alignItems:"start", gap: "1rem", textAlign:"justify"}}>
        <p>
          Aplicación Web desarrollada por <b>Imanol González</b> utilizando la API de principales variables del Banco Central de la República Argentina (BCRA). Si tienes alguna sugerencia o quieres colaborar  en el proyecto contáctame en alguna de mis redes o por medio de mi página web. <br />
          <a style={{color:"blue"}} href="https://www.bcra.gob.ar/Catalogo/apis.asp?fileName=principales-variables-v1" target="_blank">API de principales variables del BCRA</a> <br />
          <a style={{color:"blue"}} href="https://www.bcra.gob.ar/" target="_blank">Página Oficial del BCRA</a>
        </p>
        <p>
          <b>Repositorio de la aplicación en GitHub</b> <br />
          <a style={{color:"blue"}} href="https://github.com/imanolgzz/bcra-mainvariables-dashboard" target="_blank">https://github.com/imanolgzz/bcra-mainvariables-dashboard</a><br/>
        </p>
        <p>
          <b>Contacto del desarrollador</b> <br />
          Página Web:  <a style={{color:"blue"}} href="https://imanolgzz.com" target="_blank">https://imanolgzz.com</a><br/>
          X:  <a style={{color:"blue"}} href="https://twitter.com/imanolgzzDev" target="_blank">@imanolgzzDev</a> <br />
          LinkedIn:  <a style={{color:"blue"}} href="https://www.linkedin.com/in/imanolgzz/" target="_blank">imanolgzz</a>
        </p>
        
        <p>
        <b>Versión 1.0</b> <br />
          Última Actualización: 2024-05-01 <br /> 
        </p>
      </div>
      
      
    </>
  )
}