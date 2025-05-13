# 🧠 Chatbot Backend con NestJS, Ollama y PostgreSQL

Este proyecto es una API desarrollada en **NestJS** que proporciona un chatbot con capacidades de respuesta natural usando un modelo LLM (`qwen:0.5b`) a través de **Ollama**. El chatbot se alimenta de una **base de conocimientos contenida en 4 archivos PDF**, procesados en memoria como embeddings, y almacena los historiales de conversación en **PostgreSQL**.

## 🎯 Falta por corregir
-  [ ] Mejorar la busqueda de contexto(similaridad) para que sea más precisa.ya que no se esta haciendo de forma correcta
-  [ ] Mejorar (el prompt para que la ia sepa como devolver la respuesta:)la generación de respuesta para que sea más natural y no tenga que ser exacta.



## 📌 Tecnologías utilizadas

- **NestJS**: Framework para el backend.
- **Ollama**: Motor local para modelos de lenguaje como `qwen:0.5b`.
- **Angular**: Aplicación frontend que consume esta API.
- **PostgreSQL**: Base de datos para almacenar los chats e historial de conversación.
- **Swagger**: Para documentar los endpoints de la API.
- **pdf-parse**: Para extraer texto de documentos PDF.
- **Cosine Similarity**: Para comparar embeddings.
- **En memoria**: Los embeddings no se almacenan en base de datos, solo en RAM.

## 🎯 Flujo general

```text
[ Usuario pregunta ]
        ↓
[ Buscar en PDFs (embedding + similaridad) ]
        ↓
[ Extraer contexto relevante ]
        ↓
[ Generar respuesta con LLM (Ollama/qwen) usando prompt + contexto ]
        ↓
[ Devolver respuesta al usuario ]
        ↓
[ (Futuro) Guardar en historial de chat ]
```

## 📂 Estructura del proyecto

```bash
src/
│
├── domain/
│   ├── chat/          # Interfaces y entidades para el dominio de chat
│   └── vector/        # Interfaces para embeddings
│
├── infrastructure/
│   ├── vector/
│   │   └── in-memory-vector.service.ts # Servicio en memoria para embeddings
│   ├── ai/
│   │   └── ollama-agent.service.ts     # Comunicación con el modelo de Ollama
│
├── application/
│   └── use-cases/
│       └── ask-question.use-case.ts    # Caso de uso principal para responder preguntas
│
├── knowledgebase/                      # Carpeta con los PDF base
│
└── embedding/
    ├── embedding.provider.ts
    └── document-processor.service.ts   # Extrae texto de los PDF y genera embeddings
```

## 🚀 Endpoints actuales

| Método | Endpoint           | Descripción                                 |
|--------|--------------------|---------------------------------------------|
| POST   | `/chat/ask`        | Recibe una pregunta y devuelve una respuesta basada en contexto |
| GET    | `/docs`            | Interfaz Swagger con la documentación       |

## 🧠 Prompt base para Qwen

```text
Eres un asistente académico que responde preguntas con base en un contexto dado. Si no sabes la respuesta, simplemente responde que no sabes o que no hay información suficiente.
```

## 📥 Instalación

```bash
git clone <repo>
cd chatbot-backend
yarn install
```

## ⚙️ Configuración

1. Asegúrate de tener **Ollama** instalado y corriendo:
```bash
ollama run qwen:0.5b
```

2. Configura PostgreSQL (solo necesario para guardar chats más adelante).

3. Crea la carpeta `knowledgebase` en la raíz del proyecto y coloca allí tus 4 PDFs.

## ▶️ Scripts importantes

```bash
yarn run embed-docs     # Procesa los PDFs y genera embeddings
yarn start:dev          # Ejecuta el proyecto en modo desarrollo
```

## ✅ Checkpoints

### ✅ CHECKPOINT 1 – "Pregunta ↔ Respuesta Funcional"
#### - [ ] Sección 1.1 – Carga de PDFs
Crear carpeta knowledgebase/

Leer los 4 PDFs desde esa carpeta

Convertir PDFs a texto usando pdf-parse, pdfjs-dist o el loader de LangChain

Dejar los textos como Document[] de LangChain

#### - [ ] Sección 1.2 – Indexación y búsqueda con LangChain
Indexar los documentos (puede ser con MemoryVectorStore o HNSWLib)

Usar Embedding de OpenAI vía LangChain con OpenRouter

Implementar búsqueda semántica de contexto por pregunta

#### - [ ] Sección 1.3 – Preparación del Prompt y llamada a OpenRouter
Definir el prompt (puede estar en un archivo .txt o como string constante)

Armar el messages con context + prompt

Llamar a la API de OpenRouter (modelo DeepSeek) y recibir respuesta

#### - [ ] Sección 1.4 – Endpoint funcional + Swagger
Crear POST /chat/ask en NestJS

Validar que pregunta esté en el body

Enviar pregunta, buscar contexto, generar respuesta y devolverla

Documentar todo con Swagger (input, output, ejemplos)

### ✅ CHECKPOINT 2 – "Historial de Chats"
#### - [ ] Sección 2.1 – Modelo de datos (PostgreSQL + TypeORM)
Entidad Chat (id, fecha creación, título)

Entidad Message (id, chatId, pregunta, respuesta, timestamps)

#### - [ ] Sección 2.2 – Endpoints CRUD
POST /chat → crear nuevo chat

GET /chat/:id → obtener historial

GET /chat → listar chats

DELETE /chat/:id → eliminar un chat

#### - [ ] Sección 2.3 – Vinculación con flujo del chat
Modificar POST /chat/:chatId/ask para:

guardar pregunta

buscar contexto

generar respuesta

guardar respuesta

devolver resultado

#### - [ ] Sección 2.4 – Documentación Swagger completa de estos endpoints

### ✅ CHECKPOINT 3 – "Integración Angular + Documentación Final"
#### - [ ] Sección 3.1 – CORS + Configuración final de NestJS
Habilitar CORS

Asegurar seguridad mínima (throttling, headers, etc)

#### - [ ] Sección 3.2 – Conexión desde Angular
Frontend llama a: crear chat, ver historial, hacer pregunta

UX básica para mostrar respuestas del chatbot

#### - [ ] Sección 3.3 – Swagger completo y limpio
Descripciones, tags, ejemplos, esquemas DTOs bien definidos