# BASE SENCILLO:

## EMPRESA 

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

### Asignar gerente general - POST /empresas/{empresa_sujeto_id}/gerente-general:

```json
{
  "personaSujetoId": 2,
  "proyectoId": 1,
  "observacion": "Gerente general principal del proyecto"
}
```

### Registrar un expediente del gerente - POST /empresas/{sujeto_id}/reportes-expediente

**COMISION REPRESION**
```json
{
  "tipoReporte": "COMISION_REPRESION",
  "expediente": "EXP-2026-001",
  "organo": "INDECOPI",
  "partes": "DENUNCIANTE A",
  "estatus": "EN TRAMITE",
  "ordenLista": 1,
  "payloadItem": {
    "fuente": "frontend",
    "tipo": "reporte_expediente_empresa"
  }
}
```
**SALA DEFENSA**
```json
{
  "tipoReporte": "SALA_DEFENSA",
  "expediente": "EXP-SD-001",
  "organo": "SALA DE DEFENSA",
  "partes": "DENUNCIANTE D",
  "estatus": "EN TRAMITE",
  "ordenLista": 1,
  "payloadItem": {
    "fuente": "frontend",
    "tipo": "sala_defensa"
  }
}
```
**JUZGADO CIVIL**
```json
{
  "tipoReporte": "JUZGADO_CIVIL",
  "expediente": "EXP-CIV-001",
  "organo": "1ER JUZGADO CIVIL",
  "partes": "DEMANDANTE X",
  "estatus": "ACTIVO",
  "ordenLista": 1,
  "payloadItem": {
    "fuente": "frontend",
    "tipo": "juzgado_civil"
  }
}
```

**JUZGADO LABORAL**
```json
{
  "tipoReporte": "JUZGADO_LABORAL",
  "expediente": "EXP-LAB-001",
  "organo": "1ER JUZGADO LABORAL",
  "partes": "DEMANDANTE Y",
  "estatus": "EN TRAMITE",
  "ordenLista": 1,
  "payloadItem": {
    "fuente": "frontend",
    "tipo": "juzgado_laboral"
  }
}
```



### Registrar una lista simple del gerente - POST /empresas/{sujeto_id}/reportes-lista-simple

**RANKING_CONSTRUCTORAS**
```json
{
  "tipoReporte": "RANKING_CONSTRUCTORAS",
  "razonSocial": "CONSTRUCTORA PRUEBA S.A.C.",
  "cantidad": "5",
  "ordenLista": 1,
  "payloadItem": {
    "fuente": "frontend",
    "tipo": "ranking_constructoras",
    "fechas": "2024-2026"
  }
}
```
**PROTECCION**
```json
{
  "tipoReporte": "PROTECCION",
  "razonSocial": "EMPRESA RECLAMANTE",
  "cantidad": "2",
  "ordenLista": 1,
  "payloadItem": {
    "fuente": "frontend",
    "tipo": "proteccion",
    "fechas": "2025-2026"
  }
}
```
**SALA PROTECCION**
```json
{
  "tipoReporte": "SALA_PROTECCION",
  "razonSocial": "EMPRESA APELANTE",
  "cantidad": "1",
  "ordenLista": 1,
  "payloadItem": {
    "fuente": "frontend",
    "tipo": "sala_proteccion",
    "fechas": "2025-2026"
  }
}
```
**COMISION SIGNOS**
```json
{
  "tipoReporte": "COMISION_SIGNOS",
  "razonSocial": "MARCA XYZ",
  "cantidad": "3",
  "ordenLista": 1,
  "payloadItem": {
    "fuente": "frontend",
    "tipo": "comision_signos",
    "fechas": "2023-2026"
  }
}
```
**COMISION INVENTOS**
```json
{
  "tipoReporte": "COMISION_INVENTOS",
  "razonSocial": "PATENTE ABC",
  "cantidad": "1",
  "ordenLista": 1,
  "payloadItem": {
    "fuente": "frontend",
    "tipo": "comision_inventos",
    "fechas": "2022-2026"
  }
}
```

**RECLAMOS**
```json
{
  "tipoReporte": "RECLAMOS",
  "razonSocial": "Servicio de Atención al Ciudadano",
  "cantidad": "2",
  "ordenLista": 1,
  "payloadItem": {
    "tipo": "reclamos",
    "fuente": "frontend"
  }
}
```
**INFRACCIONES**


### DEUDAS - POST /empresas/{sujeto_id}/sunat-deudas
```json
{
  "monto": "12500.50",
  "periodo": "2026-03",
  "fechaTexto": "Marzo 2026",
  "entidad": "SUNAT",
  "ordenLista": 1,
  "payloadItem": {
    "fuente": "frontend",
    "tipo": "deuda_sunat"
  }
}
```

### REPRESENTANTE LEGAL - POST /empresas/{sujeto_id}/representantes-legales
```json
{
  "puestoRepresentanteLegal": "Gerente General",
  "fechaDesdeRepresentanteLegal": "2024-01-15",
  "nombreRepresentanteLegal": "JUAN CARLOS PEREZ LOPEZ",
  "documentoRepresentanteLegal": "DNI",
  "documentoNumeroRepresentanteLegal": "12345678",
  "ordenLista": 1,
  "payloadItem": {
    "fuente": "frontend",
    "tipo": "representante_legal"
  }
}
```


### Registrar ministerio vivienda - POST /empresas/{sujeto_id}/reportes-ministerio-vivienda

```json
{
  "organo": "MINISTERIO DE VIVIENDA",
  "sancion": "OBSERVACION ADMINISTRATIVA",
  "ordenLista": 1,
  "payloadItem": {
    "fuente": "frontend",
    "tipo": "ministerio_vivienda"
  }
}
```

### AFILIAR ACCIONISTAS - POST /empresas/{empresa_sujeto_id}/accionistas
**AFILIAR UNA EMPRESA**
```json
{
  "accionistaSujetoId": 20,
  "proyectoId": 4,
  "ordenLista": 1,
  "observacion": "Accionista jurídico principal",
  "payloadContexto": {
    "tipo": "JURIDICA"
  }
}
```
**AFILIAR UNA PERSONA NATURAL**
```json
{
  "accionistaSujetoId": 23,
  "proyectoId": 4,
  "ordenLista": 2,
  "observacion": "Accionista natural"
}
```

### AFILIAR ACCIONISTAS INTERNO (a la empresa accionista) - POST /empresas/{empresa_sujeto_id}/accionistas
```json
{
  "personaSujetoId": 21,
  "proyectoId": 4,
  "ordenLista": 1,
  "observacion": "Accionista interno 1"
}
```
```json
{
  "personaSujetoId": 22,
  "proyectoId": 4,
  "ordenLista": 1,
  "observacion": "Accionista interno 2"
}
```



## PERSONA

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

### Reportes-expediente - POST /personas/{sujeto_id}/reportes-expediente

**lista_reporte_comision_represion**
```json
{
  "tipoReporte": "COMISION_REPRESION",
  "expediente": "EXP-2026-001",
  "organo": "INDECOPI",
  "partes": "DENUNCIANTE A",
  "estatus": "EN TRAMITE",
  "ordenLista": 1
}
```
**lista_reporte_sala_concursal**
```json
{
  "tipoReporte": "SALA_CONCURSAL",
  "expediente": "EXP-2026-002",
  "organo": "SALA CONCURSAL",
  "partes": "DENUNCIANTE B",
  "estatus": "PENDIENTE",
  "ordenLista": 1
}
```
**lista_reporte_comision**
```json
{
  "tipoReporte": "COMISION",
  "expediente": "EXP-2026-003",
  "organo": "COMISION",
  "partes": "DENUNCIANTE C",
  "estatus": "CERRADO",
  "ordenLista": 1
}
```
**lista_reporte_juzgado_civil**
```json
{
  "tipoReporte": "JUZGADO_CIVIL",
  "expediente": "EXP-CIVIL-001",
  "organo": "1ER JUZGADO CIVIL",
  "partes": "DEMANDANTE X",
  "estatus": "ACTIVO",
  "ordenLista": 1
}
```
**lista_reporte_juzgado_familiar**
```json
{
  "tipoReporte": "JUZGADO_FAMILIAR",
  "expediente": "EXP-FAM-001",
  "organo": "JUZGADO FAMILIAR",
  "partes": "DEMANDANTE Y",
  "estatus": "ACTIVO",
  "ordenLista": 1
}
```
**lista_reporte_juzgado_laboral**
```json
{
  "tipoReporte": "JUZGADO_LABORAL",
  "expediente": "EXP-LAB-001",
  "organo": "JUZGADO LABORAL",
  "partes": "DEMANDANTE Z",
  "estatus": "EN TRAMITE",
  "ordenLista": 1
}
```

###  POST /personas/{sujeto_id}/reportes-lista-simple
**lista_reporte_proteccion**
```json
{
  "tipoReporte": "PROTECCION",
  "razonSocial": "EMPRESA OBSERVADA",
  "cantidad": "2",
  "ordenLista": 1
}
```

###  POST /personas/{sujeto_id}/reportes-ministerio-vivienda
```json
{
  "organo": "MINISTERIO DE VIVIENDA",
  "sancion": "OBSERVACION ADMINISTRATIVA",
  "ordenLista": 1
}
```

## PROYECTO

```json
{
  "proyecto": {
    "empresaPrincipalSujetoId": 1,
    "fecha1": "12 de marzo de 2026",
    "textoProyectosNatural": "Condominio Los Pinos",
    "cargaLoteId": 1,
    "payloadOriginal": {
      "fuente": "frontend",
      "origen": "formulario_manual"
    }
  }
}
```


# PRUEBA
ORDEN DE CREAR

1. Generar una empresa (generalId: 15, persona_juridica: 16)
    1. Generar Empresa persona_juridica: 16 configurando con sus accionistas-internos (18-19)
    2. Generar sunat-deudas para EmpresaGeneral, PersonaJuridica
    3. Generar sunat-omisiones para EmpresaGeneral, PersonaJuridica
    4. Generar reportes-expediente para EmpresaGeneral, PersonaJuridica
    5. Generar reportes-lista-simple para EmpresaGeneral, PersonaJuridica
    6. Generar reportes-ministerio-vivienda para EmpresaGeneral, PersonaJuridica

2. Generar una persona
    1. Generar reportes-expediente
    2. Generar reportes-lista-simple
    3. Generar reportes-ministerio-vivienda

3. Generar un proyecto con la empresa generalId(15)