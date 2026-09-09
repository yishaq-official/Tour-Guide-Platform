/**
 * RAG Controller Facade
 * 
 * Delegates to the modular AI subsystem in src/modules/ai/
 * ensuring backwards compatibility with any existing imports.
 */

export { queryRAGSystem } from "../modules/ai/ai.controller.js";
