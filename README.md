# 🧠 Chatbot Backend con NestJS, Ollama y PostgreSQL

Este proyecto es una API desarrollada en **NestJS** que proporciona un chatbot con capacidades de respuesta natural usando un modelo LLM (`qwen:0.5b`) a través de **Ollama**. El chatbot se alimenta de una **base de conocimientos contenida en 4 archivos PDF**, procesados en memoria como embeddings, y almacena los historiales de conversación en **PostgreSQL**.

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

- [ ] Procesamiento de PDFs y generación de embeddings en memoria.
- [ ] Integración con Ollama para respuestas.
- [ ] Búsqueda de contexto relevante mediante embeddings.
- [ ] Almacenamiento de conversaciones en PostgreSQL.
- [ ] Endpoint para crear y listar chats.
- [ ] Soporte para múltiples sesiones de conversación.
