# GUIA DE COMO PBOLAR LA BD
Deeph0use123
# EMPRESA

```json
{
  "sujeto": {
    "jsonPathOrigen": "$.empresa",
    "hashNegocio": "20100070970",
    "scoreValor": "780",
    "nivelRiesgo": "BAJO",
    "cantidadRiesgosNum": "2",
    "riesgosEstadoCalificacion": "NORMAL",
    "riesgosComportamientoPago": "PUNTUAL",
    "comportamiento13m": "BUENO",
    "deudaTotalTexto": "SIN OBSERVACIONES",
    "deudaTotalMonto": "10000",
    "deudaTotalCredito": "5000",
    "deudaTotalBanco": "BCP",
    "descripcionOtrasDeudas": "NINGUNA"
  },
  "empresa": {
    "nombreEmpresa": "L OREAL",
    "razonSocial": "L OREAL PERU S.A.",
    "rucEmpresa": "20100070970",
    "partidaPersonasJuridicas": "12345678",
    "partidaPersonasJuridicasDireccion": "Oficina Registral de Lima",
    "domicilioFiscal": "LIMA",
    "fechaConstitucion": "2001-01-01",
    "objetoSocialCodigo": "A0001",
    "objetoSocial": "COMERCIALIZACION DE PRODUCTOS COSMETICOS",
    "sumaNumero": "1000000",
    "sumaNumeroLetra": "UN MILLON Y 00/100 SOLES",
    "valorNominal": "10.00",
    "valorNominalNumero": "DIEZ Y 00/100 SOLES",
    "capitalMonto": "1000000",
    "capitalMontoLetras": "UN MILLON Y 00/100 SOLES",
    "capitalNumAcciones": "100000",
    "capitalValorNominal": "10.00",
    "capitalValorNominalLetras": "DIEZ Y 00/100 SOLES",
    "sunatEstadoEmpresa": "ACTIVO",
    "sunatCondicionEmpresa": "HABIDO",
    "sunatDeudaCoactiva": "NO",
    "sunatDeudaMontoTotal": "0",
    "sunatOmisiones": "NO",
    "sunatOmisionesMonto": "0",
    "sunatTrabajadoresMesFecha": "marzo",
    "sunatTrabajadoresAnioFecha": "2026",
    "sunatTrabajadores": "150",
    "sunatPrestadores": "20",
    "representantesLegalesResumen": "2",
    "infoEstablecimientosAnexosSunat": true,
    "cantidadEstablecimientos": "3",
    "nombresEstablecimientos": "SEDE LIMA, SEDE SUR, SEDE NORTE"
  }
}
```

# PERSONA (GERENTE_GENERAL)

```json
{
  "sujeto": {
    "jsonPathOrigen": "$.empresa.gerente_general",
    "hashNegocio": "DNI|12345678",
    "scoreValor": "650",
    "nivelRiesgo": "MEDIO",
    "cantidadRiesgosNum": "1",
    "riesgosEstadoCalificacion": "NORMAL",
    "riesgosComportamientoPago": "REGULAR",
    "comportamiento13m": "ESTABLE",
    "deudaTotalTexto": "SIN OBSERVACIONES",
    "deudaTotalMonto": "1500",
    "deudaTotalCredito": "800",
    "deudaTotalBanco": "BCP",
    "descripcionOtrasDeudas": "NINGUNA"
  },
  "persona": {
    "nombreCompleto": "JUAN CARLOS PEREZ LOPEZ",
    "tipoDocumento": "DNI",
    "tipoDocumentoRaw": "DNI",
    "numeroDocumento": "12345678",
    "rucPersonal": "10123456789",
    "domicilioFiscalPersonal": "LIMA",
    "estadoContribuyente": "ACTIVO",
    "condicionContribuyente": "HABIDO",
    "deudaPublicaSunat": "0",
    "omisionesTributariasSunat": "0",
    "nombreJsonRaw": "JUAN CARLOS PEREZ LOPEZ",
    "gerenteNombreJsonRaw": "JUAN CARLOS PEREZ LOPEZ",
    "gerenteNumeroDocumentoRaw": "12345678"
  }
}
```

# POST PROYECTO (/empresas/{id_empresa}/gerente-general)

```json
{
  "personaSujetoId": 14,
  "proyectoId": 4,
  "observacion": "Gerente general principal del proyecto"
}
```
