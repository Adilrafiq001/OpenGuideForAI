import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Database,
  Cpu,
  Share2,
  Terminal,
  CheckCircle,
  Copy,
  AlertTriangle,
  Shield,
  Layers,
  Info,
  HelpCircle
} from 'lucide-react';

export interface ToolSetupGuide {
  id: string;
  name: string;
  category: 'MEMORY' | 'GLUE' | 'COMPUTE' | 'HOSTING';
  badge: string;
  tagline: string;
  whatItIs: string;
  whyUseIt: string;
  prerequisites: string[];
  steps: {
    title: string;
    description: string;
    command?: string;
    codeSnippet?: string;
    note?: string;
  }[];
  smokeTest: {
    commandOrCode: string;
    expectedOutput: string;
  };
  policyCaveat2026: string;
  localAlternative: string;
}

export const FREE_TOOLS_GUIDES: ToolSetupGuide[] = [
  // --- MEMORY ---
  {
    id: 'chroma',
    name: 'Chroma',
    category: 'MEMORY',
    badge: 'OPEN SOURCE',
    tagline: 'Embed and search your data client-side or serverless with zero accounts.',
    whatItIs: 'An AI-native, open-source embedding database designed to store document vectors and perform nearest-neighbor semantic search.',
    whyUseIt: 'Zero setup friction. You can run it entirely in-memory inside Python or as a local file-based database without launching any servers or signing up for accounts.',
    prerequisites: ['Python 3.10 or higher', 'pip package manager', 'Zero credit card, zero cloud account'],
    steps: [
      {
        title: 'Step 1: Install ChromaDB via pip',
        description: 'Open your terminal or command prompt and install the official Chroma package.',
        command: 'pip install chromadb'
      },
      {
        title: 'Step 2: Create a Local In-Memory or Disk Client',
        description: 'Initialize a Chroma client in Python. To persist data to a folder on disk, use PersistentClient.',
        codeSnippet: `import chromadb

# Option A: Pure in-memory (data vanishes on script exit)
client = chromadb.Client()

# Option B: Persistent to local directory (recommended)
# client = chromadb.PersistentClient(path="./my_chroma_db")

# Create a collection for your knowledge chunks
collection = client.create_collection(name="ai_knowledge_base")`
      },
      {
        title: 'Step 3: Add Documents and Auto-Compute Embeddings',
        description: 'Chroma has a default built-in sentence-transformers embedding model, so you can pass raw text without writing embedding math.',
        codeSnippet: `collection.add(
    documents=[
        "Vectors represent semantic meaning in multi-dimensional coordinate space.",
        "RAG retrieves relevant context chunks to prevent LLM hallucinations.",
        "Pyodide runs CPython 3.12 WebAssembly directly inside the client browser."
    ],
    metadatas=[{"topic": "vectors"}, {"topic": "rag"}, {"topic": "wasm"}],
    ids=["doc1", "doc2", "doc3"]
)`
      },
      {
        title: 'Step 4: Execute Semantic Similarity Query',
        description: 'Query with natural language. Chroma computes query embeddings and calculates cosine distance automatically.',
        codeSnippet: `results = collection.query(
    query_texts=["How do we prevent AI from making up false facts?"],
    n_results=1
)
print("Top matching document:", results['documents'][0][0])
print("Matched metadata:", results['metadatas'][0][0])`
      }
    ],
    smokeTest: {
      commandOrCode: `python -c "import chromadb; c=chromadb.Client(); col=c.create_collection('test'); col.add(documents=['hello'], ids=['1']); print('Chroma Success:', col.count())"`,
      expectedOutput: 'Chroma Success: 1'
    },
    policyCaveat2026: 'Chroma is 100% open source under Apache 2.0. Chroma also offers a managed cloud service, but local in-memory and persistent SQLite engines will remain permanently free and unrestricted.',
    localAlternative: 'In-memory SQLite with vector extensions (sqlite-vec) or pure numpy cosine distance matrix.'
  },
  {
    id: 'qdrant',
    name: 'Qdrant',
    category: 'MEMORY',
    badge: 'FREE TIER / OSS',
    tagline: 'Production-grade high-throughput vector store written in Rust with payload filtering.',
    whatItIs: 'A high-performance vector similarity search engine and database with a powerful filter engine for rich payload attributes.',
    whyUseIt: 'Ideal for scaling beyond toy prototypes to millions of vectors. The Rust core provides sub-millisecond retrieval with advanced HNSW indexing.',
    prerequisites: ['Docker (for local engine) OR Web Browser (for 1GB free Qdrant Cloud cluster)', 'Python 3.10+'],
    steps: [
      {
        title: 'Step 1: Launch Local Qdrant via Docker (Zero Account)',
        description: 'Run the official Qdrant Docker image. Port 6333 handles HTTP REST & Web UI; port 6334 handles high-speed gRPC.',
        command: 'docker run -p 6333:6333 -p 6334:6334 -v $(pwd)/qdrant_storage:/qdrant/storage:z qdrant/qdrant',
        note: 'Alternatively, visit cloud.qdrant.io to create a permanent 1GB free tier cloud cluster without entering credit card details.'
      },
      {
        title: 'Step 2: Install Python Client',
        description: 'Install the official Qdrant client library.',
        command: 'pip install qdrant-client'
      },
      {
        title: 'Step 3: Connect and Create Collection with Cosine Metric',
        description: 'Specify the vector dimensionality (e.g., 384 for MiniLM or 1536 for OpenAI/Gemini) and distance metric.',
        codeSnippet: `from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

# Connect to local Docker instance
client = QdrantClient(url="http://localhost:6333")

# Create collection
client.recreate_collection(
    collection_name="research_papers",
    vectors_config=VectorParams(size=4, distance=Distance.COSINE)
)`
      },
      {
        title: 'Step 4: Upsert Points with Payloads and Query',
        description: 'Insert vectors along with custom JSON payload metadata, then search.',
        codeSnippet: `from qdrant_client.models import PointStruct

client.upsert(
    collection_name="research_papers",
    points=[
        PointStruct(id=1, vector=[0.05, 0.61, 0.76, 0.17], payload={"category": "nlp"}),
        PointStruct(id=2, vector=[0.88, 0.12, 0.33, 0.45], payload={"category": "cv"})
    ]
)

hits = client.search(
    collection_name="research_papers",
    query_vector=[0.04, 0.65, 0.72, 0.19],
    limit=1
)
print("Best match ID:", hits[0].id, "Score:", hits[0].score)`
      }
    ],
    smokeTest: {
      commandOrCode: 'curl http://localhost:6333/dashboard',
      expectedOutput: 'HTTP 200 (Qdrant Web UI renders in browser)'
    },
    policyCaveat2026: 'Qdrant Cloud provides a 1GB cluster on free tier. Cloud provider terms may adjust inactivity suspension rules; the local Docker container has zero quotas and zero external dependencies.',
    localAlternative: 'Qdrant local embedded mode: QdrantClient(path="./local_qdrant") which runs in-process without Docker.'
  },
  {
    id: 'pgvector',
    name: 'pgvector',
    category: 'MEMORY',
    badge: 'OPEN SOURCE',
    tagline: 'Vector search right inside standard PostgreSQL with ACID compliance.',
    whatItIs: 'An open-source PostgreSQL extension that stores vector embeddings as a first-class column type and adds fast indexed search.',
    whyUseIt: 'Eliminates database sprawl. Store your relational user accounts, payment history, and AI vector embeddings all in one single battle-tested database.',
    prerequisites: ['PostgreSQL 14+ with pgvector extension OR Docker OR Supabase Free Tier', 'psql CLI or Python psycopg3'],
    steps: [
      {
        title: 'Step 1: Run PostgreSQL with pgvector Pre-Installed',
        description: 'Use the official pre-compiled Docker image from the pgvector team.',
        command: 'docker run --name pgvector -e POSTGRES_PASSWORD=sovereign -p 5432:5432 -d pgvector/pgvector:pg16'
      },
      {
        title: 'Step 2: Enable the Vector Extension in SQL',
        description: 'Connect via psql and activate vector support in your database.',
        codeSnippet: `CREATE EXTENSION IF NOT EXISTS vector;`
      },
      {
        title: 'Step 3: Create a Table with Vector Embeddings Column',
        description: 'Define your table schema. The vector(3) specifies a 3-dimensional vector.',
        codeSnippet: `CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding vector(3)
);

-- Build an HNSW index for sub-millisecond approximate nearest neighbor search
CREATE INDEX ON items USING hnsw (embedding vector_cosine_ops);`
      },
      {
        title: 'Step 4: Query Nearest Neighbors Using Cosine Distance',
        description: 'The <=> operator represents cosine distance in pgvector.',
        codeSnippet: `INSERT INTO items (content, embedding) VALUES
('Attention Is All You Need', '[0.1, 0.8, 0.3]'),
('Deep Residual Learning', '[0.9, 0.1, 0.2]');

-- Query: find 1 most similar item to query vector [0.12, 0.79, 0.31]
SELECT id, content, embedding <=> '[0.12, 0.79, 0.31]' AS distance
FROM items
ORDER BY distance
LIMIT 1;`
      }
    ],
    smokeTest: {
      commandOrCode: `docker exec -it pgvector psql -U postgres -c "SELECT '[1,2,3]'::vector;"`,
      expectedOutput: '[1,2,3]'
    },
    policyCaveat2026: 'pgvector is open-source under PostgreSQL license. Fully self-hostable with no vendor lock-in.',
    localAlternative: 'SQLite with sqlite-vec extension or DuckDB with VSS extension.'
  },

  // --- GLUE ---
  {
    id: 'langchain',
    name: 'LangChain',
    category: 'GLUE',
    badge: 'FREE / OSS',
    tagline: 'Build modular RAG pipelines and autonomous agents with standard protocols.',
    whatItIs: 'A composition framework providing modular abstractions for chaining prompts, LLM invocations, vector stores, and external tools.',
    whyUseIt: 'Standardizes tool calling and retrieval chains with the LangChain Expression Language (LCEL).',
    prerequisites: ['Python 3.10+'],
    steps: [
      {
        title: 'Step 1: Install Core Packages',
        description: 'Install LangChain core and community connectors.',
        command: 'pip install langchain langchain-core langchain-community'
      },
      {
        title: 'Step 2: Construct an LCEL Composition Pipeline',
        description: 'Use the modern pipe operator (|) to compose Prompt -> LLM -> OutputParser.',
        codeSnippet: `from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 1. Template
prompt = PromptTemplate.from_template("Explain {concept} in 2 plain sentences for a beginner.")

# 2. Mock / Local Pipeline (Zero API key needed for testing)
class MockModel:
    def invoke(self, prompt_val):
        return f"[Simulated LLM response for: {prompt_val}]"

model = MockModel()

# 3. Pipe chain
chain = prompt | model | StrOutputParser()

output = chain.invoke({"concept": "Vector Embeddings"})
print(output)`
      }
    ],
    smokeTest: {
      commandOrCode: 'python -c "import langchain_core; print(langchain_core.__version__)"',
      expectedOutput: '0.3.x or higher'
    },
    policyCaveat2026: 'LangChain framework is 100% open source under MIT. Optional LangSmith cloud observability has a free community tier.',
    localAlternative: 'Pure Python with native HTTP requests or minimal smolagents.'
  },
  {
    id: 'llamaindex',
    name: 'LlamaIndex',
    category: 'GLUE',
    badge: 'FREE / OSS',
    tagline: 'Connect your private documents, PDFs, and unstructured data to models.',
    whatItIs: 'A data-first framework specialized in ingesting, parsing, chunking, indexing, and querying private enterprise documents.',
    whyUseIt: 'Unrivaled document loaders (LlamaParse, PDF readers, Notion, GitHub) and specialized multi-strategy retrieval algorithms.',
    prerequisites: ['Python 3.10+'],
    steps: [
      {
        title: 'Step 1: Install LlamaIndex',
        description: 'Install the core package via pip.',
        command: 'pip install llama-index llama-index-core'
      },
      {
        title: 'Step 2: Ingest Local Documents and Build Vector Index',
        description: 'Index all text documents in a directory in 4 lines of code.',
        codeSnippet: `from llama_index.core import VectorStoreIndex, Document

# Ingest sample documents
docs = [
    Document(text="OpenGuide teaches AI engineering with $0 paid software subscriptions."),
    Document(text="Pyodide runs CPython 3.12 WebAssembly directly inside web browsers.")
]

# Build in-memory vector index
index = VectorStoreIndex.from_documents(docs)

# Create query engine
query_engine = index.as_query_engine()
print("LlamaIndex successfully initialized.")`
      }
    ],
    smokeTest: {
      commandOrCode: 'python -c "import llama_index.core; print(llama_index.core.__version__)"',
      expectedOutput: '0.11.x or higher'
    },
    policyCaveat2026: 'LlamaIndex core is MIT open source. LlamaCloud offers a hosted option, but the standalone Python library runs 100% locally.',
    localAlternative: 'Custom chunking functions with Python standard library and sqlite-vec.'
  },

  // --- COMPUTE ---
  {
    id: 'colab',
    name: 'Google Colab',
    category: 'COMPUTE',
    badge: 'FREE',
    tagline: '15GB RAM, free NVIDIA T4 GPU, zero terminal installation required.',
    whatItIs: 'A hosted Jupyter notebook environment provided by Google that runs directly in your web browser with free access to GPU compute.',
    whyUseIt: 'Run modern 7B/8B open-source LLMs, fine-tune models, or run PyTorch training scripts without buying expensive GPU hardware.',
    prerequisites: ['Google Account', 'Modern Web Browser (Chrome, Firefox, Safari, Edge)'],
    steps: [
      {
        title: 'Step 1: Open Google Colab',
        description: 'Navigate to colab.research.google.com and click "New Notebook".',
        note: 'Zero installation on your local machine.'
      },
      {
        title: 'Step 2: Attach Free NVIDIA T4 GPU Accelerator',
        description: 'In the top menu bar, click Runtime -> Change runtime type. Under "Hardware accelerator", select "T4 GPU" and click Save.',
        note: 'Free tier grants an NVIDIA T4 with 15GB VRAM and ~12GB system RAM.'
      },
      {
        title: 'Step 3: Verify GPU Hardware in First Cell',
        description: 'Type and execute this shell command in the first code cell to verify GPU allocation.',
        command: '!nvidia-smi'
      },
      {
        title: 'Step 4: Use Colab Secrets for Zero-Commit API Keys',
        description: 'Click the Key icon on the left sidebar (Secrets). Add your keys (e.g. GEMINI_API_KEY) with Notebook access enabled. Then access securely in code.',
        codeSnippet: `from google.colab import userdata
api_key = userdata.get('GEMINI_API_KEY')
print("Secret loaded securely with zero code leakage.")`
      }
    ],
    smokeTest: {
      commandOrCode: '!nvidia-smi --query-gpu=name,memory.total --format=csv',
      expectedOutput: 'name, memory.total\nTesla T4, 15360 MiB'
    },
    policyCaveat2026: 'Google Colab free tier sessions disconnect after ~90 minutes of inactivity or up to 12 hours continuous. GPU availability depends on dynamic regional demand.',
    localAlternative: 'OpenGuide in-browser Pyodide IDE (for CPU/WASM) or Ollama with local CPU/GPU.'
  },
  {
    id: 'kaggle',
    name: 'Kaggle',
    category: 'COMPUTE',
    badge: 'FREE 30H/WK',
    tagline: '30 hours/week of free NVIDIA T4/P100 GPU compute with persistent datasets.',
    whatItIs: 'A data science and machine learning community platform offering free Jupyter notebooks with guaranteed 30 weekly GPU hours.',
    whyUseIt: 'Dual T4 GPUs (T4 x2) allow parallel model inference and distributed training that single-GPU free environments cannot match.',
    prerequisites: ['Kaggle Account', 'SMS Phone Verification (required once to enable free GPU & Internet access)'],
    steps: [
      {
        title: 'Step 1: Create Notebook and Verify Phone',
        description: 'Go to kaggle.com/code, click "New Notebook". If not already verified, verify your phone in account settings to unlock GPU access.',
        note: 'Verification is free and required to prevent bot abuse.'
      },
      {
        title: 'Step 2: Enable Dual GPU Accelerator & Internet',
        description: 'In the right sidebar panel under "Notebook options": Set Accelerator -> GPU T4 x2. Set Internet -> On.',
        note: 'Turning Internet On allows pip installs inside the notebook session.'
      },
      {
        title: 'Step 3: Run PyTorch Multi-GPU Verification',
        description: 'Verify both GPUs are recognized by PyTorch.',
        codeSnippet: `import torch
print("CUDA Available:", torch.cuda.is_available())
print("Device Count:", torch.cuda.device_count())
for i in range(torch.cuda.device_count()):
    print(f"Device {i}:", torch.cuda.get_device_name(i))`
      }
    ],
    smokeTest: {
      commandOrCode: '!nvidia-smi',
      expectedOutput: 'Displays two NVIDIA Tesla T4 GPUs (16GB VRAM each)'
    },
    policyCaveat2026: 'Quota resets weekly to 30 GPU hours. Notebook sessions automatically save outputs to /kaggle/working.',
    localAlternative: 'Local hardware with PyTorch ROCm (AMD) or CUDA (NVIDIA).'
  },

  // --- HOSTING ---
  {
    id: 'hf-spaces',
    name: 'Hugging Face Spaces',
    category: 'HOSTING',
    badge: 'DEPLOY FREE',
    tagline: '2 vCPU • 16GB RAM • Free public domain for interactive ML web apps.',
    whatItIs: 'A free container hosting service for sharing interactive machine learning demos and Python applications with the public.',
    whyUseIt: 'Free permanent HTTPS subdomain (e.g. username-app.hf.space), automatic git-push deployments, and built-in support for Gradio, Streamlit, and Docker.',
    prerequisites: ['Hugging Face Account (free)', 'Git installed locally'],
    steps: [
      {
        title: 'Step 1: Create a New Space',
        description: 'Go to huggingface.co/spaces and click "Create new Space". Give it a name, select "Gradio" (or Docker/Streamlit), and choose "CPU Basic • 2 vCPU • 16GB • Free".',
        note: 'Zero credit card required.'
      },
      {
        title: 'Step 2: Clone Space Repository Locally',
        description: 'Clone the newly created space using git.',
        command: 'git clone https://huggingface.co/spaces/YOUR_USERNAME/my-ai-app'
      },
      {
        title: 'Step 3: Create app.py and requirements.txt',
        description: 'Write a minimal Gradio interface in app.py.',
        codeSnippet: `# app.py
import gradio as gr

def summarize(text):
    return f"Summary of {len(text.split())} words: {text[:100]}..."

demo = gr.Interface(
    fn=summarize,
    inputs=gr.Textbox(placeholder="Enter text to analyze..."),
    outputs="text",
    title="Sovereign AI Analyzer"
)

if __name__ == "__main__":
    demo.launch()`
      },
      {
        title: 'Step 4: Push to Deploy Live',
        description: 'Commit and push to origin main. Hugging Face automatically builds the container and brings your app live in under 60 seconds.',
        command: 'git add app.py requirements.txt\ngit commit -m "feat: initial deploy"\ngit push origin main'
      }
    ],
    smokeTest: {
      commandOrCode: 'curl -I https://YOUR_USERNAME-my-ai-app.hf.space',
      expectedOutput: 'HTTP/2 200'
    },
    policyCaveat2026: 'Spaces sleep after 48 hours of inactivity on the free tier and wake up automatically on the next HTTP request in ~15 seconds.',
    localAlternative: 'Host locally with ngrok / Cloudflare Tunnel for free public endpoints.'
  },
  {
    id: 'streamlit-cloud',
    name: 'Streamlit Community Cloud',
    category: 'HOSTING',
    badge: 'DEPLOY FREE',
    tagline: 'Deploy interactive Python apps directly from GitHub with zero DevOps.',
    whatItIs: 'A managed platform that connects directly to your GitHub repository and serves Streamlit Python web applications.',
    whyUseIt: 'Pure Python frontend and backend. Write data apps with sliders, tables, and charts with zero HTML or JavaScript knowledge.',
    prerequisites: ['GitHub Account', 'Streamlit Account connected to GitHub'],
    steps: [
      {
        title: 'Step 1: Push Python Code to Public GitHub Repository',
        description: 'Create a GitHub repo containing app.py and requirements.txt.',
        codeSnippet: `# app.py
import streamlit as st

st.set_page_config(page_title="AI Studio", page_icon="⚡")
st.title("OpenGuide $0 Stack Demo")
user_input = st.text_input("Enter your prompt:")
if user_input:
    st.success(f"Processing: {user_input}")`
      },
      {
        title: 'Step 2: Sign In to Streamlit Community Cloud',
        description: 'Visit share.streamlit.io, sign in with GitHub, and click "New app".',
        note: 'Authorize Streamlit to read your public GitHub repositories.'
      },
      {
        title: 'Step 3: Select Repo and Click Deploy',
        description: 'Choose your repository, branch (main), and file path (app.py). Click "Deploy!". Streamlit provisions a live web URL automatically.',
        note: 'Every subsequent git push automatically updates the live app.'
      }
    ],
    smokeTest: {
      commandOrCode: 'Open your generated share.streamlit.io URL in browser',
      expectedOutput: 'Displays running Streamlit application'
    },
    policyCaveat2026: 'Streamlit Community Cloud offers up to 1GB resource limit per app. Apps that see no traffic for 7 consecutive days enter sleep mode and wake up on click.',
    localAlternative: 'Run locally via `streamlit run app.py` or export static frontend to Cloudflare Pages.'
  }
];

interface FreeToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: 'MEMORY' | 'GLUE' | 'COMPUTE' | 'HOSTING';
  initialToolId?: string;
}

export const FreeToolsModal: React.FC<FreeToolsModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'MEMORY',
  initialToolId
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'MEMORY' | 'GLUE' | 'COMPUTE' | 'HOSTING'>(initialCategory);
  const [selectedToolId, setSelectedToolId] = useState<string>(initialToolId || 'chroma');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  // Sync initial props
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
    if (initialToolId) {
      setSelectedToolId(initialToolId);
    } else {
      const firstInCat = FREE_TOOLS_GUIDES.find(t => t.category === initialCategory);
      if (firstInCat) setSelectedToolId(firstInCat.id);
    }
  }, [initialCategory, initialToolId, isOpen]);

  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

  // Handle Escape key & body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const currentTools = useMemo(() => {
    return FREE_TOOLS_GUIDES.filter(t => t.category === selectedCategory);
  }, [selectedCategory]);

  const currentTool = useMemo(() => {
    return FREE_TOOLS_GUIDES.find(t => t.id === selectedToolId) || currentTools[0] || FREE_TOOLS_GUIDES[0];
  }, [selectedToolId, currentTools]);

  const handleCopy = async (text: string, id: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setCopiedIndex(id);
        if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
        copiedTimerRef.current = setTimeout(() => setCopiedIndex(null), 2000);
      }
    } catch {}
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tools-modal-title"
      >
        <motion.div
          ref={modalRef}
          tabIndex={-1}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="relative w-full max-w-6xl h-[92vh] max-h-[850px] bg-[var(--color-primary)] border border-[var(--color-border)] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[var(--color-text-primary)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--color-border)] bg-[var(--color-secondary)]/50 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Shield size={16} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 id="tools-modal-title" className="text-sm sm:text-base font-bold truncate">
                    Four Tools. Zero Subscriptions. — Step-by-Step Setup
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    2026 VERIFIED GUIDELINES
                  </span>
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)] truncate">
                  Granular, idiot-proof walkthroughs for every layer of the $0 sovereign AI engineer stack.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[var(--color-secondary)] hover:bg-[var(--color-border)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer shrink-0"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>

          {/* Category Navigation Bar */}
          <div className="flex items-center gap-2 px-5 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-secondary)]/20 overflow-x-auto shrink-0">
            {(['MEMORY', 'GLUE', 'COMPUTE', 'HOSTING'] as const).map(cat => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    const first = FREE_TOOLS_GUIDES.find(t => t.category === cat);
                    if (first) setSelectedToolId(first.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[var(--color-secondary)] border border-[var(--color-accent)] text-[var(--color-accent)] shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-transparent'
                  }`}
                >
                  {cat === 'MEMORY' && <Database size={13} />}
                  {cat === 'GLUE' && <Layers size={13} />}
                  {cat === 'COMPUTE' && <Cpu size={13} />}
                  {cat === 'HOSTING' && <Share2 size={13} />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Body Layout: Tool Sub-Navigation + Granular Setup Guide */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            
            {/* Left Sub-Nav: Tools in current category */}
            <div className="w-full md:w-60 lg:w-64 border-b md:border-b-0 md:border-r border-[var(--color-border)] bg-[var(--color-secondary)]/30 flex flex-col shrink-0 overflow-y-auto p-3 space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)] font-bold px-1 mb-1">
                {selectedCategory} Stack Tools
              </div>

              {currentTools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedToolId(tool.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex flex-col gap-1 cursor-pointer ${
                    selectedToolId === tool.id
                      ? 'bg-[var(--color-secondary)] border border-[var(--color-accent)] shadow-sm'
                      : 'hover:bg-[var(--color-secondary)]/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--color-text-primary)]">
                      {tool.name}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                      {tool.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-secondary)] line-clamp-2 leading-tight">
                    {tool.tagline}
                  </p>
                </button>
              ))}

              {/* Category Mental Model Card */}
              <div className="mt-4 p-3 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[var(--color-text-primary)] text-[11px]">
                  <HelpCircle size={12} className="text-[var(--color-accent)]" />
                  <span>Why {selectedCategory}?</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {selectedCategory === 'MEMORY' && 'LLMs have zero long-term memory. Vector DBs store your notes and code as coordinates so models recall context in 5ms.'}
                  {selectedCategory === 'GLUE' && 'Frameworks wire static LLM models to live data, vector stores, and automated APIs without manual string parsing.'}
                  {selectedCategory === 'COMPUTE' && 'Running models locally requires expensive GPUs. These free environments give you NVIDIA T4/P100 GPUs at zero cost.'}
                  {selectedCategory === 'HOSTING' && 'Deploy live web interfaces for your AI tools so anyone can test your work without paying cloud hosting bills.'}
                </p>
              </div>
            </div>

            {/* Right Pane: Granular Setup Guide */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 min-h-0 bg-[var(--color-primary)]">
              
              {/* Tool Header Overview */}
              <div className="bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-2xl p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                        {currentTool.name}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        {currentTool.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-medium">
                      {currentTool.tagline}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-[var(--color-primary)]/50 border border-[var(--color-border)]">
                    <span className="font-bold text-[var(--color-text-primary)] block mb-1">What It Does:</span>
                    <span className="text-[var(--color-text-secondary)] leading-relaxed">{currentTool.whatItIs}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--color-primary)]/50 border border-[var(--color-border)]">
                    <span className="font-bold text-[var(--color-text-primary)] block mb-1">Why We Picked It:</span>
                    <span className="text-[var(--color-text-secondary)] leading-relaxed">{currentTool.whyUseIt}</span>
                  </div>
                </div>

                {/* Prerequisites */}
                <div className="pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[var(--color-text-secondary)] block mb-1.5">
                    Prerequisites ($0 Hard Constraint):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentTool.prerequisites.map((req, idx) => (
                      <span 
                        key={idx}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[var(--color-primary)] border border-[var(--color-border)] text-emerald-400 flex items-center gap-1.5"
                      >
                        <CheckCircle size={11} />
                        <span>{req}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step-by-Step Granular Guide */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-secondary)] flex items-center gap-2">
                  <Terminal size={14} className="text-[var(--color-accent)]" />
                  <span>Granular Setup Instructions</span>
                </h4>

                {currentTool.steps.map((step, idx) => (
                  <div 
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-[var(--color-secondary)]/50 border border-[var(--color-border)] space-y-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 text-[var(--color-accent)] flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <h5 className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)]">
                        {step.title}
                      </h5>
                    </div>

                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed pl-8">
                      {step.description}
                    </p>

                    {/* Shell Command (if present) */}
                    {step.command && (
                      <div className="ml-8 relative">
                        <div className="p-3 rounded-xl bg-black/90 border border-[var(--color-border)] font-mono text-xs text-emerald-400 overflow-x-auto pr-12">
                          <code>{step.command}</code>
                        </div>
                        <button
                          onClick={() => handleCopy(step.command!, `cmd-${idx}`)}
                          className="absolute right-2 top-2 p-1.5 rounded-lg bg-[var(--color-secondary)] hover:bg-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white transition-colors cursor-pointer"
                          aria-label="Copy command"
                        >
                          {copiedIndex === `cmd-${idx}` ? (
                            <CheckCircle size={13} className="text-emerald-400" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      </div>
                    )}

                    {/* Python / Code Snippet (if present) */}
                    {step.codeSnippet && (
                      <div className="ml-8 relative">
                        <pre className="p-4 rounded-xl bg-black/90 border border-[var(--color-border)] font-mono text-xs text-emerald-400 overflow-x-auto pr-12 leading-relaxed">
                          <code>{step.codeSnippet}</code>
                        </pre>
                        <button
                          onClick={() => handleCopy(step.codeSnippet!, `code-${idx}`)}
                          className="absolute right-2 top-2 p-1.5 rounded-lg bg-[var(--color-secondary)] hover:bg-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white transition-colors cursor-pointer"
                          aria-label="Copy code"
                        >
                          {copiedIndex === `code-${idx}` ? (
                            <CheckCircle size={13} className="text-emerald-400" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      </div>
                    )}

                    {step.note && (
                      <div className="ml-8 p-2.5 rounded-lg bg-[var(--color-primary)]/70 border border-[var(--color-border)] text-[11px] text-[var(--color-text-secondary)] flex items-start gap-2">
                        <Info size={13} className="text-amber-400 shrink-0 mt-0.5" />
                        <span>{step.note}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Smoke Test Verification Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <CheckCircle size={15} />
                  <span>Step-by-Step Smoke Test (Verify Your Setup)</span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Execute this verification command in your terminal. If the output matches below, your setup is 100% operational:
                </p>
                
                <div className="relative">
                  <div className="p-3 rounded-xl bg-black/90 border border-emerald-500/30 font-mono text-xs text-emerald-400 overflow-x-auto pr-12">
                    <code>{currentTool.smokeTest.commandOrCode}</code>
                  </div>
                  <button
                    onClick={() => handleCopy(currentTool.smokeTest.commandOrCode, 'smoke')}
                    className="absolute right-2 top-2 p-1.5 rounded-lg bg-[var(--color-secondary)] hover:bg-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white transition-colors cursor-pointer"
                    aria-label="Copy smoke test"
                  >
                    {copiedIndex === 'smoke' ? (
                      <CheckCircle size={13} className="text-emerald-400" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>

                <div className="text-[11px] font-mono text-[var(--color-text-secondary)]">
                  Expected Output: <span className="text-emerald-300 font-bold">{currentTool.smokeTest.expectedOutput}</span>
                </div>
              </div>

              {/* 2026 Policy Notice & Local Fallback */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <AlertTriangle size={14} />
                  <span>2026 Free Tier Policy Notice & Future-Proofing</span>
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                  {currentTool.policyCaveat2026}
                </p>
                <div className="text-[11px] text-[var(--color-text-secondary)] pt-1 border-t border-amber-500/20">
                  <strong className="text-[var(--color-text-primary)]">Permanent Local Alternative: </strong>
                  {currentTool.localAlternative}
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-[var(--color-border)] bg-[var(--color-secondary)]/50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs">
            <span className="font-mono text-[11px] text-[var(--color-text-secondary)]">
              All tools verified for $0 barrier to entry • No paid subscriptions required
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-border)] border border-[var(--color-border)] font-semibold transition-colors cursor-pointer"
            >
              Close Setup Guide
            </button>
          </div>
        </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
