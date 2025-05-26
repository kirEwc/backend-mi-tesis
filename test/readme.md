# 🧪 Test Strategy by Module

## 1. TF-IDF Module (`TfidfRetrieverModule`) 📚

### Unit Tests 🔍

- **Document Loading**
  - Test `loadAndSplit()` with different chunk sizes
  - 📄 *File: tfidf.service.ts:27-61*

- **Indexing**
  - Verify `index()` correctly generates TF-IDF matrix
  - 📄 *File: tfidf.service.ts:66-91*

- **Semantic Search**
  - Test `query()` with various queries and k values
  - 📄 *File: tfidf.service.ts:131-161*

- **Cosine Similarity**
  - Verify `cosineSimilarity()` calculations
  - 📄 *File: tfidf.service.ts:112-126*

### Functional Tests 🔄

- **Complete Endpoints**
  - Test flow: `/tfidf/load` → `/tfidf/index` → `/tfidf/query`
  - 📄 *File: tfidf.controller.ts:12-50*

- **Persistence**
  - Verify index saves and loads correctly from `tfidf_index.json`

## 2. Ask-Question Module (`AskQuestionModule`) ❓

### Unit Tests 🔍

- **Question Processing**
  - Test `procesarPregunta()` TF-IDF and Response integration
  - 📄 *File: ask-question.service.ts:13-24*

- **DTO Validation**
  - Verify `AskQuestionDto` with valid/invalid data
  - 📄 *File: ask-question.dto.ts:5-15*

### Integration Tests 🔄

- **Complete Flow**
  - Test `/ask-question/:idChat` endpoint
  - Coordinates TF-IDF, Response, and Chat
  - 📄 *File: ask-question.controller.ts:29-46*

- **Chat Persistence**
  - Verify Q&A storage functionality
  - 📄 *File: chat.service.ts:44-55*

## 3. Response Module (`RespuestaModule`) 💬

### Unit Tests 🔍

- **Input Validation**
  - Test handling of missing parameters

- **AI Integration**
  - Mock OpenRouter API calls

- **Error Handling**
  - Test various API failure scenarios

## Security Tests 🔒

### System-wide Checks

- **Input Sanitization**
  - Prevent injection in questions and context

- **API Key Protection**
  - Ensure credentials are not exposed

- **PDF Validation**
  - Ensure only valid PDFs are processed

## Performance Tests ⚡

### Critical Points

- **Document Loading**
  - Measure large PDF processing time

- **TF-IDF Search**
  - Evaluate latency with varying index sizes

- **AI Calls**
  - Measure OpenRouter API response time

- **Complete Flow**
  - Test end-to-end latency for ask-question use case

## Usability Tests 👥

### System Quality

- **Result Relevance**
  - Evaluate TF-IDF context relevance

- **Response Coherence**
  - Verify AI responses align with defined prompt

- **Edge Cases**
  - Test behavior with no relevant context
