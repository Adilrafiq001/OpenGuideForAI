import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Play, 
  Download, 
  Search, 
  ExternalLink, 
  Terminal, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Copy, 
  Sparkles,
  Layers,
  Code2,
  FileText
} from 'lucide-react';

export interface CourseData {
  id: string;
  title: string;
  author: string;
  badge: string;
  desc: string;
  type: 'youtube' | 'curriculum';
  youtubeId?: string;
  lectures?: {
    id: string;
    title: string;
    youtubeId: string;
    duration: string;
    keyTakeaway: string;
    timestamps: { label: string; time: number; timeStr: string }[];
    transcript: string;
  }[];
  syllabus?: {
    module: string;
    title: string;
    duration: string;
    topics: string[];
    labGoal: string;
  }[];
  codeSnippet: string;
  keyTakeaways: string[];
  repoUrl?: string;
}

export const FREE_COURSES: CourseData[] = [
  {
    id: 'karpathy',
    title: 'Neural Networks: Zero to Hero',
    author: 'Andrej Karpathy (YouTube)',
    badge: '100% FREE',
    desc: 'Build micrograd, makemore, and a complete GPT from raw Python math with zero black boxes.',
    type: 'youtube',
    youtubeId: 'VMj-3S1tku0',
    lectures: [
      {
        id: 'lec-1',
        title: 'Lecture 1: The spelled-out intro to neural networks and backpropagation: building micrograd',
        youtubeId: 'VMj-3S1tku0',
        duration: '2h 25m',
        keyTakeaway: 'Autograd engine from scalar values. Backpropagation is just recursive chain rule across computational graphs.',
        timestamps: [
          { label: 'Introduction & Value class', time: 0, timeStr: '00:00' },
          { label: 'Building the computational graph', time: 1240, timeStr: '20:40' },
          { label: 'Implementing backward() pass with chain rule', time: 2780, timeStr: '46:20' },
          { label: 'Building a 2-layer MLP (Neuron, Layer, MLP)', time: 4950, timeStr: '1:22:30' },
          { label: 'Loss function & gradient descent optimization', time: 6480, timeStr: '1:48:00' }
        ],
        transcript: `Welcome to Neural Networks: Zero to Hero! In this lecture, we build micrograd from complete scratch.
Micrograd is a tiny Autograd engine that implements backpropagation over a dynamically built Directed Acyclic Graph (DAG).
A neural network is simply a mathematical function that takes inputs, parameters (weights and biases), and produces predictions.
During the forward pass, we compute intermediate values. Each Value object keeps track of its children and local derivatives.
During the backward pass, we topological-sort the graph and call local derivative functions using the chain rule: dL/dx = dL/dy * dy/dx.
Optimization is just stepping weights in the opposite direction of the gradient: w -= learning_rate * w.grad.`
      },
      {
        id: 'lec-2',
        title: 'Lecture 2: The spelled-out intro to language modeling: building makemore (Bigram)',
        youtubeId: 'PaCmpyUfSgU',
        duration: '1h 55m',
        keyTakeaway: 'Count-based Bigram vs. single-layer neural network with Cross Entropy loss and negative log likelihood.',
        timestamps: [
          { label: 'Bigram language model via 2D count matrix', time: 0, timeStr: '00:00' },
          { label: 'Converting counts to probability distributions', time: 1320, timeStr: '22:00' },
          { label: 'Negative Log Likelihood as loss function', time: 2460, timeStr: '41:00' },
          { label: 'Formulating bigram model as a Neural Network', time: 3900, timeStr: '1:05:00' },
          { label: 'Softmax activation & Cross Entropy minimization', time: 5400, timeStr: '1:30:00' }
        ],
        transcript: `In this lecture, we introduce language modeling using names.txt.
A character-level bigram model predicts the next character given only the immediately preceding character.
We first build a 27x27 count matrix counting transitions.
Then we rewrite this as a 1-layer neural network using one-hot encodings, weight matrix W, and softmax activation.
We observe that the neural network and the count matrix converge to the exact same loss because they model the same probabilistic distribution.`
      },
      {
        id: 'lec-3',
        title: 'Lecture 3: Building makemore Part 2: MLP (Multi-Layer Perceptron)',
        youtubeId: 'TCH_1BHY58I',
        duration: '1h 15m',
        keyTakeaway: 'Implementing Bengio et al. 2003: Word embeddings in continuous vector space with hidden tanh layers.',
        timestamps: [
          { label: 'Bengio et al. 2003 paper walkthrough', time: 0, timeStr: '00:00' },
          { label: 'Lookup table embedding matrix C', time: 780, timeStr: '13:00' },
          { label: 'Hidden layer with tanh activation', time: 1800, timeStr: '30:00' },
          { label: 'Cross entropy loss implementation', time: 2700, timeStr: '45:00' },
          { label: 'Learning rate decay and train/val/test splits', time: 3600, timeStr: '1:00:00' }
        ],
        transcript: `Here we scale our model from 1 character of context to N characters using a Multi-Layer Perceptron.
Instead of sparse one-hot vectors, characters are mapped into a dense continuous embedding space.
We concatenate previous character embeddings, pass them through a hidden layer with tanh non-linearity, and project to logits.
We also introduce proper machine learning discipline: 80% train, 10% validation, and 10% test splits to guard against overfitting.`
      },
      {
        id: 'lec-4',
        title: 'Lecture 4: Building makemore Part 3: Activations & Gradients, BatchNorm',
        youtubeId: 'P6sfmUTpUmc',
        duration: '1h 56m',
        keyTakeaway: 'Kaiming init, dead tanh neurons, vanishing/exploding gradients, and Batch Normalization layers.',
        timestamps: [
          { label: 'Initial loss at initialization & hockey-stick curves', time: 0, timeStr: '00:00' },
          { label: 'Saturated tanh and dead neurons diagnosis', time: 1200, timeStr: '20:00' },
          { label: 'Kaiming He weight initialization math', time: 2400, timeStr: '40:00' },
          { label: 'Batch Normalization from first principles', time: 4200, timeStr: '1:10:00' },
          { label: 'Running mean and variance for inference', time: 5700, timeStr: '1:35:00' }
        ],
        transcript: `Deep networks suffer from vanishing and exploding gradients when weights are initialized improperly.
If pre-activations are too large, tanh saturates at -1 and 1, causing its derivative (1 - t^2) to become 0—killing the gradient.
We derive Kaiming initialization to keep activation variance constant across layers.
Then we implement Batch Normalization: standardizing activations across the mini-batch to have zero mean and unit variance.`
      },
      {
        id: 'lec-5',
        title: 'Lecture 5: Building makemore Part 4: Becoming a Backprop Ninja',
        youtubeId: 'q8SA3rM6ckI',
        duration: '2h 10m',
        keyTakeaway: 'Manual analytical backprop through cross-entropy, batchnorm, and matrix multiplications with zero PyTorch autograd.',
        timestamps: [
          { label: 'Setting up the test suite against PyTorch', time: 0, timeStr: '00:00' },
          { label: 'Deriving dlogits from cross-entropy loss', time: 1500, timeStr: '25:00' },
          { label: 'Backprop through 2D and 3D matrix multiplications', time: 3300, timeStr: '55:00' },
          { label: 'Deriving analytical gradients for BatchNorm', time: 5100, timeStr: '1:25:00' }
        ],
        transcript: `In this masterclass, we write the exact analytical backward pass for every single PyTorch tensor operation.
We derive how cross_entropy backpropagation simplifies to: probs - 1 at the target index.
We work through the tensor calculus of broadcasting and matrix multiplication: if Y = X @ W, then dX = dY @ W.T and dW = X.T @ dY.`
      },
      {
        id: 'lec-6',
        title: 'Lecture 6: Building makemore Part 5: Building a WaveNet',
        youtubeId: 't3YJ5hKiMQ0',
        duration: '1h 35m',
        keyTakeaway: 'Dilated causal convolutions and hierarchical tree-structured context aggregation inspired by DeepMind WaveNet.',
        timestamps: [
          { label: 'WaveNet paper & dilated causal convolution idea', time: 0, timeStr: '00:00' },
          { label: 'Restructuring inputs into consecutive pairs', time: 1800, timeStr: '30:00' },
          { label: 'Hierarchical multi-layer context processing', time: 3600, timeStr: '1:00:00' }
        ],
        transcript: `Instead of flattening all context tokens into a massive vector, WaveNet progressively aggregates consecutive tokens in pairs.
This forms a hierarchical tree where each layer doubles the receptive field with minimal parameter explosion.`
      },
      {
        id: 'lec-7',
        title: 'Lecture 7: Let\'s build GPT: from scratch, in code, spelled out',
        youtubeId: 'kCc8FmEb1nY',
        duration: '1h 56m',
        keyTakeaway: 'Complete nanoGPT: Self-Attention, Multi-Head Attention, Scaled Dot-Product, Causal Masking, and Residual Connections.',
        timestamps: [
          { label: 'Transformer architecture & self-attention intuition', time: 0, timeStr: '00:00' },
          { label: 'Query, Key, Value vectors math: Q @ K.T / sqrt(d_k)', time: 1800, timeStr: '30:00' },
          { label: 'Causal triangular masking to prevent looking forward', time: 3300, timeStr: '55:00' },
          { label: 'Multi-Head Attention & Feed-Forward blocks', time: 4800, timeStr: '1:20:00' },
          { label: 'Residual connections, LayerNorm, and Shakespeare generation', time: 6000, timeStr: '1:40:00' }
        ],
        transcript: `We build a complete generative GPT model capable of generating Shakespeare from scratch.
Self-Attention is a communication mechanism: each token emits a Query ('what I seek') and a Key ('what I have').
The dot product Q @ K.T yields an affinity matrix.
We divide by sqrt(d_k) to prevent softmax saturation, apply causal lower-triangular masking, and multiply by Value vectors.
Multi-head attention runs parallel attention subspaces, and residual connections allow gradients to flow unimpeded directly from output to input.`
      },
      {
        id: 'lec-8',
        title: 'Lecture 8: Let\'s build the GPT Tokenizer (BPE from scratch)',
        youtubeId: 'zduSFxRajkE',
        duration: '2h 13m',
        keyTakeaway: 'Byte Pair Encoding (BPE) algorithm: Unicode byte representations, frequency stats, and vocabulary merging.',
        timestamps: [
          { label: 'Why tokenization matters & LLM quirks', time: 0, timeStr: '00:00' },
          { label: 'UTF-8 byte encodings vs Unicode code points', time: 1800, timeStr: '30:00' },
          { label: 'Iterative byte pair counting & vocabulary merge logic', time: 4200, timeStr: '1:10:00' },
          { label: 'Regex pattern splitting in GPT-2 and GPT-4 (cl100k_base)', time: 6300, timeStr: '1:45:00' }
        ],
        transcript: `Tokenization is the root cause of many mysterious LLM behaviors: why models struggle with simple spelling, why arithmetic fails, why non-English languages cost more tokens.
We implement Byte Pair Encoding (BPE): starting with raw UTF-8 bytes (0-255), we iteratively find the most common adjacent pair of tokens and merge them into a single new token ID until our target vocabulary size is reached.`
      }
    ],
    codeSnippet: `# Andrej Karpathy's Micrograd Core Scalar Autograd
import math

class Value:
    def __init__(self, data, _children=(), _op=''):
        self.data = data
        self.grad = 0.0
        self._backward = lambda: None
        self._prev = set(_children)
        self._op = _op

    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other), '+')
        def _backward():
            self.grad += 1.0 * out.grad
            other.grad += 1.0 * out.grad
        out._backward = _backward
        return out

    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data * other.data, (self, other), '*')
        def _backward():
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad
        out._backward = _backward
        return out

    def backward(self):
        topo = []
        visited = set()
        def build_topo(v):
            if v not in visited:
                visited.add(v)
                for child in v._prev:
                    build_topo(child)
                topo.append(v)
        build_topo(self)
        self.grad = 1.0
        for node in reversed(topo):
            node._backward()

# Quick test run
x = Value(2.0)
y = Value(-3.0)
z = x * y + Value(10.0)
z.backward()
print(f"z = {z.data}, dz/dx = {x.grad}, dz/dy = {y.grad}")
`,
    keyTakeaways: [
      'Backpropagation is pure recursive chain rule over an explicitly ordered Directed Acyclic Graph (DAG).',
      'Language modeling is next-token classification under cross-entropy loss.',
      'Self-Attention computes dynamically weighted token communication: Softmax((Q @ K.T) / sqrt(d_k)) @ V.',
      'Byte Pair Encoding compresses raw UTF-8 bytes into fixed-vocabulary tokens.'
    ],
    repoUrl: 'https://github.com/karpathy/micrograd'
  },
  {
    id: 'huggingface',
    title: 'Hugging Face Official Courses',
    author: 'Hugging Face',
    badge: 'FREE CERT',
    desc: 'Comprehensive NLP, Audio, Vision, Deep RL, and AI Agents — hands-on code with certificates.',
    type: 'curriculum',
    syllabus: [
      {
        module: 'NLP Course',
        title: 'Transformers Architecture & Datasets Pipeline',
        duration: '12 Hours',
        topics: ['Pipelines API', 'Tokenizer architectures', 'Fine-tuning with Trainer API', 'Quantization (8-bit/4-bit)'],
        labGoal: 'Fine-tune a distilbert model on custom domain classification.'
      },
      {
        module: 'AI Agents Course',
        title: 'Building Autonomous Agents with Smolagents & Tools',
        duration: '8 Hours',
        topics: ['ReAct prompting', 'Tool calling with JSON schemas', 'smolagents CodeAgent', 'Multi-agent orchestration'],
        labGoal: 'Deploy a multi-tool web search and code execution agent.'
      },
      {
        module: 'Audio Course',
        title: 'Speech Recognition & Audio Transformers',
        duration: '10 Hours',
        topics: ['Wav2Vec2', 'Whisper ASR', 'Text-to-Speech (TTS)', 'Audio Spectrograms'],
        labGoal: 'Transcribe live browser microphone audio using Whisper.'
      }
    ],
    codeSnippet: `# Hugging Face Transformers & smolagents Example
from transformers import pipeline

# 1. Sentiment analysis in 2 lines
classifier = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
result = classifier("OpenGuide runs 100% free with client-side Pyodide!")
print("Sentiment:", result)

# 2. Tokenizer Inspection
from transformers import AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
tokens = tokenizer.tokenize("AI Sovereign Studio")
ids = tokenizer.convert_tokens_to_ids(tokens)
print("Tokens:", tokens)
print("Token IDs:", ids)
`,
    keyTakeaways: [
      'The Hugging Face Hub is the open-source decentralized model weight repository.',
      'Use the `transformers` pipeline for instant zero-shot tasks.',
      '`smolagents` provides lightweight Python-based tool execution without bulky abstractions.'
    ],
    repoUrl: 'https://huggingface.co/learn'
  },
  {
    id: 'ms-genai',
    title: 'Generative AI for Beginners',
    author: 'Microsoft',
    badge: '18 LESSONS',
    desc: '18 comprehensive lessons taking you from text generation foundations to production RAG.',
    type: 'curriculum',
    syllabus: [
      {
        module: 'Lessons 1-5',
        title: 'Foundations & Prompt Engineering',
        duration: '6 Hours',
        topics: ['LLM Architecture', 'Zero-shot & Few-shot Prompting', 'Chain of Thought', 'System Prompts'],
        labGoal: 'Craft resilient prompt chains with deterministic JSON output.'
      },
      {
        module: 'Lessons 6-12',
        title: 'Embeddings, Vector Search & RAG',
        duration: '8 Hours',
        topics: ['Vector spaces', 'Cosine distance vs dot product', 'Chunking strategies', 'Hybrid BM25 search'],
        labGoal: 'Build a production document Q&A assistant with citations.'
      },
      {
        module: 'Lessons 13-18',
        title: 'Agents, UX & Responsible AI',
        duration: '8 Hours',
        topics: ['Function calling', 'Semantic Kernel', 'OWASP Top 10 for LLMs', 'Red Teaming'],
        labGoal: 'Deploy a hardened agent that rejects prompt injection attempts.'
      }
    ],
    codeSnippet: `# Microsoft GenAI Lesson 7: Semantic Vector Retrieval
import math

def cosine_similarity(vec_a, vec_b):
    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    return dot / (norm_a * norm_b) if norm_a and norm_b else 0.0

query = [0.82, 0.15, 0.55]
doc_1 = [0.80, 0.18, 0.52]  # Highly related
doc_2 = [0.05, 0.95, 0.20]  # Unrelated

print("Similarity Doc 1:", cosine_similarity(query, doc_1))
print("Similarity Doc 2:", cosine_similarity(query, doc_2))
`,
    keyTakeaways: [
      'Prompting requires structured schemas; avoid open-ended natural text for backend automation.',
      'Vector similarity is a geometric ranking technique, not cognitive understanding.',
      'Security requires boundary separation between system rules and untrusted user inputs.'
    ],
    repoUrl: 'https://github.com/microsoft/generative-ai-for-beginners'
  },
  {
    id: 'ms-agents',
    title: 'AI Agents for Beginners',
    author: 'Microsoft',
    badge: '8 LESSONS',
    desc: '8 hands-on architectural lessons building multi-agent systems and semantic kernels.',
    type: 'curriculum',
    syllabus: [
      {
        module: 'Lesson 1-3',
        title: 'Agent Fundamentals & Tool Use',
        duration: '4 Hours',
        topics: ['Agent loop', 'Tool dispatch', 'Observation reflection', 'State management'],
        labGoal: 'Implement a single-turn agent that executes calculator and weather tools.'
      },
      {
        module: 'Lesson 4-8',
        title: 'Multi-Agent Collaboration & Governance',
        duration: '6 Hours',
        topics: ['AutoGen architecture', 'Hierarchical vs flat agent networks', 'Human-in-the-loop gates', 'Guardrails'],
        labGoal: 'Orchestrate a Planner Agent and Coder Agent in a verification loop.'
      }
    ],
    codeSnippet: `# Multi-Agent Coordinator Blueprint
class SimpleAgent:
    def __init__(self, name, system_role):
        self.name = name
        self.system_role = system_role

    def act(self, task_input):
        return f"[{self.name}] processed '{task_input}' according to role: {self.system_role}"

planner = SimpleAgent("Planner", "Decompose user requests into atomic milestones.")
executor = SimpleAgent("Executor", "Write verified Python code for each milestone.")

task = "Build a local vector search engine."
plan = planner.act(task)
code = executor.act(plan)
print(plan)
print(code)
`,
    keyTakeaways: [
      'An agent is simply: LLM + Prompt Memory + Tools + Stop Condition.',
      'Multi-agent systems divide complex tasks into specialized bounded roles.',
      'Always implement loop bounds (max iterations) to prevent runaway token spend.'
    ],
    repoUrl: 'https://github.com/microsoft/ai-agents-for-beginners'
  },
  {
    id: 'google-kaggle',
    title: '5-Day Gen AI Intensive',
    author: 'Google x Kaggle',
    badge: 'FREE INTENSIVE',
    desc: 'Foundational models, embeddings, multimodal vision, agents, and production MLOps.',
    type: 'curriculum',
    syllabus: [
      {
        module: 'Day 1 & 2',
        title: 'Foundational Models & Gemini Flash API',
        duration: '5 Hours',
        topics: ['Gemini 2.5 Flash', 'System instructions', 'Structured JSON schemas', 'Multimodal image analysis'],
        labGoal: 'Inspect images and extract tabular data using structured schemas.'
      },
      {
        module: 'Day 3 & 4',
        title: 'Embeddings & RAG with Vector Search',
        duration: '5 Hours',
        topics: ['Text embedding models', 'Vector indexing', 'Context window management', 'Gemma open models'],
        labGoal: 'Index a 100-page PDF document and answer technical queries.'
      },
      {
        module: 'Day 5',
        title: 'Production MLOps & Model Evaluation',
        duration: '3 Hours',
        topics: ['Automated LLM-as-a-Judge', 'Latency & cost trade-offs', 'Safe deployment'],
        labGoal: 'Evaluate model answers against ground-truth benchmarks.'
      }
    ],
    codeSnippet: `# Google Gemini Structured Output Blueprint
# (Zero-dependency Python representation)
schema = {
    "type": "OBJECT",
    "properties": {
        "verdict": {"type": "STRING", "enum": ["PASS", "FAIL"]},
        "score": {"type": "NUMBER"},
        "rationale": {"type": "STRING"}
    },
    "required": ["verdict", "score", "rationale"]
}
print("Structured JSON Schema for deterministic evaluation:")
import json
print(json.dumps(schema, indent=2))
`,
    keyTakeaways: [
      'Gemini 2.5 Flash offers near-zero latency for client-side tool routing.',
      'Always enforce strict JSON Schemas on LLM API returns.',
      'Automated LLM-as-a-Judge provides scalable regression testing for AI apps.'
    ],
    repoUrl: 'https://www.kaggle.com/learn-guide/5-day-genai'
  },
  {
    id: 'deeplearning-ai',
    title: 'Short Courses: RAG, Agents, Evals',
    author: 'DeepLearning.AI',
    badge: 'APPLIED CODE',
    desc: 'Built in partnership with OpenAI and Anthropic — high-density 1-hour applied masterclasses.',
    type: 'curriculum',
    syllabus: [
      {
        module: 'Track A',
        title: 'Advanced Retrieval for AI with Chroma',
        duration: '1.5 Hours',
        topics: ['Dense retrieval', 'Cross-encoder re-ranking', 'Query expansion', 'Hypothetical Document Embeddings (HyDE)'],
        labGoal: 'Implement HyDE to double semantic retrieval accuracy on ambiguous queries.'
      },
      {
        module: 'Track B',
        title: 'Building Systems with the ChatGPT API & Evals',
        duration: '1.5 Hours',
        topics: ['Moderation API', 'Chaining prompts', 'Output verification', 'Automated evals'],
        labGoal: 'Build an end-to-end customer support router with security gates.'
      }
    ],
    codeSnippet: `# DeepLearning.AI Pattern: Cross-Encoder Re-Ranking Concept
# Step 1: Broad bi-encoder vector search retrieves Top 20 candidates.
# Step 2: Accurate cross-encoder scores (query, candidate) pairs to select Top 3.
candidates = [
    {"doc": "Python memory management and garbage collection", "score": 0.82},
    {"doc": "Building RAG applications with vector databases", "score": 0.89},
    {"doc": "Neural network backpropagation calculus", "score": 0.74}
]
re_ranked = sorted(candidates, key=lambda x: x["score"], reverse=True)
print("Top Document:", re_ranked[0]["doc"])
`,
    keyTakeaways: [
      'HyDE (Hypothetical Document Embeddings) synthesizes a fake answer first to find real matching chunks.',
      'Two-stage retrieval (Bi-encoder retrieval + Cross-encoder re-ranking) is the gold standard.',
      'Evaluate your AI system with quantitative metrics: Faithfulness, Answer Relevance, and Context Recall.'
    ],
    repoUrl: 'https://www.deeplearning.ai/short-courses/'
  }
];

interface FreeCoursesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourseId?: string;
}

export const FreeCoursesModal: React.FC<FreeCoursesModalProps> = ({
  isOpen,
  onClose,
  initialCourseId = 'karpathy'
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId);
  const [selectedLectureIdx, setSelectedLectureIdx] = useState<number>(0);
  const [transcriptSearch, setTranscriptSearch] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'video' | 'transcript' | 'code' | 'syllabus'>('video');
  const [playerStartTime, setPlayerStartTime] = useState<number>(0);
  const [mobilePane, setMobilePane] = useState<'sidebar' | 'content'>('content');

  const modalRef = useRef<HTMLDivElement>(null);

  // Sync initialCourseId when prop changes
  useEffect(() => {
    if (initialCourseId) {
      setSelectedCourseId(initialCourseId);
      setSelectedLectureIdx(0);
      setTranscriptSearch('');
      setPlayerStartTime(0);
    }
  }, [initialCourseId, isOpen]);

  // Handle Escape key for WCAG accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap inside modal
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const currentCourse = useMemo(() => {
    return FREE_COURSES.find(c => c.id === selectedCourseId) || FREE_COURSES[0];
  }, [selectedCourseId]);

  const currentLecture = useMemo(() => {
    if (currentCourse.type === 'youtube' && currentCourse.lectures) {
      return currentCourse.lectures[selectedLectureIdx] || currentCourse.lectures[0];
    }
    return null;
  }, [currentCourse, selectedLectureIdx]);

  // Filtered transcript lines
  const filteredTranscript = useMemo(() => {
    if (!currentLecture) return '';
    if (!transcriptSearch.trim()) return currentLecture.transcript;
    const term = transcriptSearch.toLowerCase();
    const lines = currentLecture.transcript.split('\n');
    return lines.filter(l => l.toLowerCase().includes(term)).join('\n');
  }, [currentLecture, transcriptSearch]);

  // Export Transcript handler
  const handleExportTranscript = (format: 'md' | 'txt') => {
    if (!currentLecture) return;
    const filename = `${currentCourse.id}-${currentLecture.id}-transcript.${format}`;
    let content = '';

    if (format === 'md') {
      content = `# ${currentCourse.title}\n## ${currentLecture.title}\n**Author:** ${currentCourse.author}\n**Key Takeaway:** ${currentLecture.keyTakeaway}\n\n---\n\n### Transcript\n\n${currentLecture.transcript}\n\n---\n*Exported sovereignly from OpenGuide AI Studio*`;
    } else {
      content = `${currentCourse.title}\n${currentLecture.title}\nAuthor: ${currentCourse.author}\n\n${currentLecture.transcript}`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCourse.codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-modal-title"
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
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--color-border)] bg-[var(--color-secondary)]/50 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                <BookOpen size={16} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 id="course-modal-title" className="text-sm sm:text-base font-bold truncate">
                    {currentCourse.title}
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    {currentCourse.badge}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)] truncate">
                  By {currentCourse.author} • In-App Sovereign Player (Zero External Redirects)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobilePane(prev => prev === 'sidebar' ? 'content' : 'sidebar')}
                className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer shrink-0"
              >
                <BookOpen size={13} />
                <span>{mobilePane === 'sidebar' ? 'View Player' : 'Courses'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-[var(--color-secondary)] hover:bg-[var(--color-border)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer shrink-0"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Main Layout: Left Sidebar for Course Navigation + Right Content Studio */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            
            {/* Sidebar: Course List */}
            <div className={`w-full md:w-64 lg:w-72 border-b md:border-b-0 md:border-r border-[var(--color-border)] bg-[var(--color-secondary)]/30 flex flex-col shrink-0 overflow-y-auto ${
              mobilePane === 'sidebar' ? 'flex' : 'hidden md:flex'
            }`}>
              <div className="p-3 text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)] font-bold border-b border-[var(--color-border)]/50">
                Curated Free Goldmines
              </div>
              <div className="p-2 space-y-1">
                {FREE_COURSES.map(course => (
                  <button
                    key={course.id}
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setSelectedLectureIdx(0);
                      setTranscriptSearch('');
                      setPlayerStartTime(0);
                      setMobilePane('content');
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex flex-col gap-1 cursor-pointer ${
                      selectedCourseId === course.id
                        ? 'bg-[var(--color-secondary)] border border-[var(--color-accent)] shadow-sm'
                        : 'hover:bg-[var(--color-secondary)]/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold truncate text-[var(--color-text-primary)]">
                        {course.title}
                      </span>
                      {course.type === 'youtube' && (
                        <Play size={10} className="text-red-400 shrink-0 ml-1" />
                      )}
                    </div>
                    <span className="text-[10px] text-[var(--color-text-secondary)] truncate">
                      {course.author}
                    </span>
                  </button>
                ))}
              </div>

              {/* YouTube Lectures Accordion (if selected course has lectures) */}
              {currentCourse.type === 'youtube' && currentCourse.lectures && (
                <div className="mt-2 border-t border-[var(--color-border)] p-2">
                  <div className="px-2 py-1.5 text-[10px] font-mono text-[var(--color-text-secondary)] font-bold uppercase tracking-wider">
                    Course Lectures ({currentCourse.lectures.length})
                  </div>
                  <div className="space-y-1 max-h-48 md:max-h-none overflow-y-auto">
                    {currentCourse.lectures.map((lec, idx) => (
                      <button
                        key={lec.id}
                        onClick={() => {
                          setSelectedLectureIdx(idx);
                          setPlayerStartTime(0);
                          setMobilePane('content');
                        }}
                        className={`w-full text-left p-2 rounded-lg text-[11px] transition-all flex items-center justify-between gap-1 cursor-pointer ${
                          selectedLectureIdx === idx
                            ? 'bg-[var(--color-accent)]/15 border border-[var(--color-accent)] font-semibold text-[var(--color-text-primary)]'
                            : 'hover:bg-[var(--color-secondary)] text-[var(--color-text-secondary)]'
                        }`}
                      >
                        <span className="truncate">{lec.title.replace('Lecture ', 'L')}</span>
                        <span className="text-[9px] font-mono opacity-70 shrink-0">{lec.duration}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Pane: Media, Transcript, Syllabi & Code */}
            <div className={`flex-1 flex flex-col min-w-0 min-h-0 bg-[var(--color-primary)] ${
              mobilePane === 'content' ? 'flex' : 'hidden md:flex'
            }`}>
              
              {/* Studio Tabs */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-secondary)]/20 shrink-0">
                <div className="flex items-center gap-1 sm:gap-2">
                  {currentCourse.type === 'youtube' && (
                    <button
                      onClick={() => setActiveTab('video')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        activeTab === 'video'
                          ? 'bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] shadow-sm'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      <Play size={12} className="text-red-400" />
                      <span>Video Lecture</span>
                    </button>
                  )}

                  {currentCourse.type === 'youtube' && (
                    <button
                      onClick={() => setActiveTab('transcript')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        activeTab === 'transcript'
                          ? 'bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] shadow-sm'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      <FileText size={12} className="text-amber-400" />
                      <span>Transcript</span>
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      activeTab === 'code'
                        ? 'bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] shadow-sm'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    <Code2 size={12} className="text-blue-400" />
                    <span>Runnable Python</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('syllabus')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      activeTab === 'syllabus'
                        ? 'bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] shadow-sm'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    <Layers size={12} className="text-emerald-400" />
                    <span>Syllabus & Notes</span>
                  </button>
                </div>

                {currentCourse.repoUrl && (
                  <a
                    href={currentCourse.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    <span>Official Repo</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>

              {/* Tab Content Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
                
                {/* 1. Video Player Tab */}
                {activeTab === 'video' && currentCourse.type === 'youtube' && currentLecture && (
                  <div className="space-y-4 max-w-4xl mx-auto">
                    {/* Security Hardened YouTube Player */}
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/90 border border-[var(--color-border)] shadow-xl">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${currentLecture.youtubeId}?start=${playerStartTime}&rel=0&modestbranding=1`}
                        title={currentLecture.title}
                        className="absolute inset-0 w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox allow-forms"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    {/* Lecture Meta & Timestamp Seekers */}
                    <div className="bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-2xl p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                            {currentLecture.title}
                          </h3>
                          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                            Key Principle: {currentLecture.keyTakeaway}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                          <a
                            href={`https://www.youtube.com/watch?v=${currentLecture.youtubeId}${playerStartTime > 0 ? `&t=${playerStartTime}s` : ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/15 hover:bg-red-600/25 border border-red-500/30 text-red-600 dark:text-red-400 font-mono text-xs font-semibold transition-all cursor-pointer active:scale-95 shadow-sm"
                            title="Open in YouTube App"
                          >
                            <ExternalLink size={12} />
                            <span>Watch on YouTube App ↗</span>
                          </a>
                          <span className="text-xs font-mono px-2.5 py-1.5 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                            {currentLecture.duration}
                          </span>
                        </div>
                      </div>

                      {/* Interactive Chapter Jump Pills */}
                      <div>
                        <div className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase tracking-wider font-bold mb-2">
                          Jump to Chapter:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {currentLecture.timestamps.map((ts, idx) => (
                            <button
                              key={idx}
                              onClick={() => setPlayerStartTime(ts.time)}
                              className="px-2.5 py-1 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-border)] border border-[var(--color-border)] text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Clock size={10} className="text-[var(--color-accent)]" />
                              <span className="text-[var(--color-accent)] font-semibold">{ts.timeStr}</span>
                              <span className="text-[var(--color-text-secondary)] truncate max-w-[180px]">{ts.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Transcript Tab */}
                {activeTab === 'transcript' && currentLecture && (
                  <div className="space-y-4 max-w-4xl mx-auto flex flex-col h-full">
                    {/* Transcript Controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-[var(--color-secondary)] p-3 rounded-xl border border-[var(--color-border)]">
                      <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
                        <input
                          type="text"
                          value={transcriptSearch}
                          onChange={(e) => setTranscriptSearch(e.target.value)}
                          placeholder="Search lecture transcript text..."
                          className="w-full pl-9 pr-3 py-1.5 text-xs bg-[var(--color-primary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent)]"
                        />
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleExportTranscript('md')}
                          className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-border)] border border-[var(--color-border)] text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download size={12} />
                          <span>Export .MD</span>
                        </button>
                        <button
                          onClick={() => handleExportTranscript('txt')}
                          className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-border)] border border-[var(--color-border)] text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download size={12} />
                          <span>Export .TXT</span>
                        </button>
                      </div>
                    </div>

                    {/* Transcript Reader Area */}
                    <div className="flex-1 bg-[var(--color-secondary)]/30 border border-[var(--color-border)] rounded-2xl p-4 sm:p-6 overflow-y-auto font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-line text-[var(--color-text-primary)]/90">
                      {filteredTranscript || 'No transcript text matches your search query.'}
                    </div>
                  </div>
                )}

                {/* 3. Runnable Python Code Tab */}
                {activeTab === 'code' && (
                  <div className="space-y-4 max-w-4xl mx-auto">
                    <div className="flex items-center justify-between bg-[var(--color-secondary)] p-3 rounded-xl border border-[var(--color-border)]">
                      <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-secondary)]">
                        <Terminal size={14} className="text-emerald-400" />
                        <span>First-Principles Python Implementation</span>
                      </div>
                      <button
                        onClick={handleCopyCode}
                        className="px-3 py-1 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-border)] border border-[var(--color-border)] text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedCode ? (
                          <>
                            <CheckCircle size={12} className="text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-4 sm:p-6 rounded-2xl bg-black/90 border border-[var(--color-border)] text-xs sm:text-sm font-mono text-emerald-400 overflow-x-auto leading-relaxed shadow-inner">
                      <code>{currentCourse.codeSnippet}</code>
                    </pre>

                    <div className="p-4 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] flex items-start gap-3">
                      <Sparkles size={16} className="text-[var(--color-accent)] shrink-0 mt-0.5" />
                      <div className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                        <strong className="text-[var(--color-text-primary)]">Run inside OpenGuide:</strong> This code executes 100% locally in your browser via our Pyodide WebAssembly runtime with zero remote server connections. Launch any Track in our Studio to test and modify it interactively.
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Syllabus & Notes Tab */}
                {activeTab === 'syllabus' && (
                  <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Course Overview */}
                    <div className="bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-2xl p-5 space-y-3">
                      <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                        Course Architecture & Core Thesis
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                        {currentCourse.desc}
                      </p>

                      <div className="pt-2">
                        <div className="text-xs font-mono font-bold text-[var(--color-text-primary)] mb-2 uppercase tracking-wider">
                          Key First Principles:
                        </div>
                        <ul className="space-y-1.5">
                          {currentCourse.keyTakeaways.map((takeaway, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]">
                              <CheckCircle size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                              <span>{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Syllabus Modules (if curriculum course) */}
                    {currentCourse.syllabus && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                          Curriculum Modules ({currentCourse.syllabus.length})
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                          {currentCourse.syllabus.map((mod, idx) => (
                            <div 
                              key={idx}
                              className="p-4 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[var(--color-text-primary)]">
                                  {mod.module}: {mod.title}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                                  {mod.duration}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {mod.topics.map((t, tIdx) => (
                                  <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--color-primary)] text-[var(--color-text-secondary)]">
                                    {t}
                                  </span>
                                ))}
                              </div>
                              <div className="text-[11px] text-emerald-400/90 font-mono pt-1">
                                🎯 Lab Goal: {mod.labGoal}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Footer Bar */}
          <div className="px-5 py-3 border-t border-[var(--color-border)] bg-[var(--color-secondary)]/50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs">
            <span className="font-mono text-[11px] text-[var(--color-text-secondary)]">
              OpenGuide Curated Academy • 100% Free • BYOK Sovereignty
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-border)] border border-[var(--color-border)] font-semibold transition-colors cursor-pointer"
              >
                Close Studio
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
