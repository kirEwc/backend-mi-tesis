# Sistema de Búsqueda Semántica con TF-IDF

## Descripción General
Sistema backend para procesamiento de documentos PDF y búsqueda semántica usando el algoritmo TF-IDF. Proporciona endpoints RESTful para:
- Carga y fragmentación de documentos
- Creación de índices semánticos
- Búsqueda de documentos relevantes
- Integración con modelos de lenguaje

## Módulos Principales

### 1. TF-IDF Retriever
- **Propósito**: Procesamiento de documentos y cálculo de relevancia semántica
- **Funcionalidades**:
  - `/tfidf/load`: Carga documentos PDF y los divide en fragmentos
  - `/tfidf/index`: Genera el índice TF-IDF
  - `/tfidf/query`: Realiza búsquedas semánticas

### 2. Ask Question
- **Propósito**: Integración con modelos de lenguaje para respuestas enriquecidas
- **Endpoints**:
  - `/ask`: Combina resultados TF-IDF con generación de respuestas

### 3. Respuesta
- **Propósito**: Gestión de respuestas estructuradas y formato de salida
  - `/respuesta/pregunta`: le envias una pregunta `string` + un contexto `string` + el `PROMPT` y te devuelve una respuesta `string`

## Requisitos de Instalación
```bash
npm install
```

## Configuración
Crear archivo `.env` con:
```env
OPENAI_API_KEY=tu_clave_aqui
PORT=3000
```

## Uso Básico
1. Iniciar servidor:
```bash
npm run start
```

2. Cargar documentos:
```bash
curl -X POST http://localhost:3000/tfidf/load -H "Content-Type: application/json" -d '{"chunkSize": 500}'
```

3. Crear índice:
```bash
curl -X POST http://localhost:3000/tfidf/index
```

4. Realizar consulta:
```bash
curl "http://localhost:3000/tfidf/query?q=modelos%20de%20lenguaje&k=3"
```

## Estructura de Directorios
```
├── src/
│   ├── TFIDF/          # Lógica de procesamiento semántico
│   ├── usecases/       # Casos de uso principales
│   ├── app.module.ts   # Configuración general
└── .env                # Variables de entorno
```