import { create } from 'zustand';

export type SupportedLanguage = 'en' | 'es' | 'zh' | 'hi' | 'fr' | 'de';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'zh', name: 'Mandarin', nativeName: '中文' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' }
];

export function isNonLatinLanguage(lang: SupportedLanguage): boolean {
  return lang === 'hi' || lang === 'zh';
}

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    heroTag: '100% Free & Open Source',
    heroSubTag: 'Zero Coding Knowledge Required',
    heroTitlePrefix: 'Zero To',
    heroTitleSuffix: 'AI Engineer.',
    heroDescription: 'The comprehensive, zero-cost curriculum built for everyone. Master neural networks, vector databases, RAG, and autonomous agents through crystal-clear plain language and browser-native execution.',
    launchTrack0: 'Launch Track 0',
    explorePathways: 'Explore Learning Paths',
    firstPrinciplesLabel: 'Curriculum First Principles • Click Any Question to Unpack',
    exploreAllQuestions: 'Explore All 15 Why • How • What Questions',
    pathwaysHeading: 'Adaptive Learning Pathways',
    pathwaysSubtitle: 'Everyone learns differently. Choose the journey calibrated to your current background.',
    freeStackHeading: 'Four Tools. Zero Subscriptions.',
    freeStackSubtitle: 'You do not need expensive cloud subscriptions to become an AI Engineer. Here is the verified free ecosystem.',
    curriculumTitle: 'Curriculum Architecture',
    curriculumSubtitle: 'From Metal to Neural Intelligence',
    themePalette: 'Color Themes',
    enterBriefing: 'Enter Mission Briefing',
    synapseLoungeTitle: 'The Synapse Lounge',
    synapseLoungeSubtitle: 'Cognitive Gym & Neuro-Plasticity Lab • Sharpen Your Mind',
    synapseLoungeDesc: 'Intense syntax reading induces cognitive fatigue. Modern cognitive science shows that switching to spatial alignment and deductive logic games activates subconscious consolidation—solidifying AI mental models while sharpening working memory.',
    whyPythonLabel: 'Why Python for AI?',
    whyWasmLabel: 'Why Local WASM?',
    whyVectorLabel: 'Why Vector DBs?',
    whyRAGLabel: 'Why RAG?',
    whyZeroBudgetLabel: 'Why $0 Budget Stack?'
  },
  es: {
    heroTag: '100% Gratuito y Código Abierto',
    heroSubTag: 'Sin Conocimientos de Programación Previos',
    heroTitlePrefix: 'De Cero a',
    heroTitleSuffix: 'Ingeniero de IA.',
    heroDescription: 'El plan de estudios integral y de costo cero para todos. Domina redes neuronales, bases de datos vectoriales, RAG y agentes autónomos con lenguaje claro y ejecución nativa en el navegador.',
    launchTrack0: 'Iniciar Pista 0',
    explorePathways: 'Explorar Rutas',
    firstPrinciplesLabel: 'Principios Fundamentales • Haz Clic para Explorar',
    exploreAllQuestions: 'Explorar las 15 Preguntas (Por Qué • Cómo • Qué)',
    pathwaysHeading: 'Rutas de Aprendizaje Adaptativas',
    pathwaysSubtitle: 'Cada persona aprende a su ritmo. Elige el camino calibrado para tu nivel actual.',
    freeStackHeading: 'Cuatro Herramientas. Cero Suscripciones.',
    freeStackSubtitle: 'No necesitas costosas suscripciones en la nube para convertirte en Ingeniero de IA.',
    curriculumTitle: 'Arquitectura del Plan de Estudios',
    curriculumSubtitle: 'Del Metal a la Inteligencia Neuronal',
    themePalette: 'Temas de Color',
    enterBriefing: 'Entrar al Resumen',
    synapseLoungeTitle: 'The Synapse Lounge',
    synapseLoungeSubtitle: 'Gimnasio Cognitivo y Neuroplasticidad • Agudiza tu Mente',
    synapseLoungeDesc: 'El estudio técnico intenso agota la memoria de trabajo. La ciencia cognitiva demuestra que alternar con juegos espaciales y deductivos consolida modelos mentales de IA y previene el bloqueo mental.',
    whyPythonLabel: '¿Por qué Python para IA?',
    whyWasmLabel: '¿Por qué WASM Local?',
    whyVectorLabel: '¿Por qué BD Vectoriales?',
    whyRAGLabel: '¿Por qué RAG?',
    whyZeroBudgetLabel: '¿Por qué Presupuesto $0?'
  },
  zh: {
    heroTag: '100% 免费与开源',
    heroSubTag: '无需任何编程或数学基础',
    heroTitlePrefix: '从零成为',
    heroTitleSuffix: '人工智能工程师。',
    heroDescription: '专为初学者打造的零成本 AI 工程师系统课程。在浏览器中直观理解神经网络、向量数据库、RAG 和自主智能体。',
    launchTrack0: '启动 Track 0',
    explorePathways: '探索学习路径',
    firstPrinciplesLabel: '第一性原理直觉 • 点击任意问题展开深度解析',
    exploreAllQuestions: '探索全部 15 项 为什么 • 如何 • 什么是 核心知识',
    pathwaysHeading: '自适应学习路径',
    pathwaysSubtitle: '每个人的学习节奏各不相同。选择契合你当前背景的学习路线。',
    freeStackHeading: '四套工具，零订阅费用。',
    freeStackSubtitle: '成为 AI 工程师无需昂贵的云账单。以下是经过实战验证的完全免费技术栈。',
    curriculumTitle: '课程架构',
    curriculumSubtitle: '从底层算力到神经网络认知',
    themePalette: '主题配色',
    enterBriefing: '进入任务简报',
    synapseLoungeTitle: 'The Synapse Lounge',
    synapseLoungeSubtitle: '突触认知健身房与神经可塑性实验室 • 提神益智',
    synapseLoungeDesc: '持续研读代码容易引发认知疲劳。认知神经科学表明，切换至空间向量对齐和感知机演绎推理解密游戏，能激活大脑的发散模式，巩固核心概念并提升工作记忆容量。',
    whyPythonLabel: '为什么 AI 首选 Python？',
    whyWasmLabel: '为什么使用本地 WASM？',
    whyVectorLabel: '为什么需要向量数据库？',
    whyRAGLabel: '为什么必须使用 RAG？',
    whyZeroBudgetLabel: '为什么坚持 $0 预算？'
  },
  hi: {
    heroTag: '100% निःशुल्क और ओपन सोर्स',
    heroSubTag: 'बिना किसी पूर्व कोडिंग ज्ञान के',
    heroTitlePrefix: 'शून्य से',
    heroTitleSuffix: 'एआई इंजीनियर।',
    heroDescription: 'शुरुआती लोगों के लिए पूरी तरह से मुफ़्त एआई पाठ्यक्रम। सरल भाषा और इन-ब्राउज़र निष्पादन के साथ न्यूरल नेटवर्क, वेक्टर डेटाबेस और एआई एजेंट सीखें।',
    launchTrack0: 'ट्रैक 0 शुरू करें',
    explorePathways: 'सीखने के रास्ते देखें',
    firstPrinciplesLabel: 'पाठ्यक्रम मौलिक सिद्धांत • विस्तार से जानने के लिए क्लिक करें',
    exploreAllQuestions: 'सभी 15 प्रश्न देखें (क्यों • कैसे • क्या)',
    pathwaysHeading: 'अनुकूलनीय शिक्षण पथ',
    pathwaysSubtitle: 'हर कोई अलग तरह से सीखता है। अपनी पृष्ठभूमि के अनुसार सही रास्ता चुनें।',
    freeStackHeading: 'चार उपकरण। शून्य सदस्यता शुल्क।',
    freeStackSubtitle: 'एआई इंजीनियर बनने के लिए महंगे क्लाउड सब्सक्रिप्शन की कोई आवश्यकता नहीं है।',
    curriculumTitle: 'पाठ्यक्रम संरचना',
    curriculumSubtitle: 'कंप्यूटिंग से न्यूरल इंटेलिजेंस तक',
    themePalette: 'रंग थीम',
    enterBriefing: 'मिशन ब्रीफिंग में जाएं',
    synapseLoungeTitle: 'The Synapse Lounge',
    synapseLoungeSubtitle: 'कॉग्निटिव जिम और न्यूरो-प्लास्टिसिटी लैब • दिमाग तेज़ करें',
    synapseLoungeDesc: 'गहन अध्ययन से दिमागी थकान होती है। संज्ञानात्मक विज्ञान के अनुसार, वेक्टर अलाइनमेंट और लॉजिक गेम्स खेलने से डिफ्यूज-मोड सक्रिय होता है—जिससे एआई के सिद्धांत पक्के होते हैं और मानसिक एकाग्रता बढ़ती है।',
    whyPythonLabel: 'एआई के लिए पायथन क्यों?',
    whyWasmLabel: 'स्थानीय WASM क्यों?',
    whyVectorLabel: 'वेक्टर डेटाबेस क्यों?',
    whyRAGLabel: 'RAG क्यों आवश्यक है?',
    whyZeroBudgetLabel: '$0 बजट स्टैक क्यों?'
  },
  fr: {
    heroTag: '100% Gratuit et Open Source',
    heroSubTag: 'Aucune Connaissance en Programmation Requise',
    heroTitlePrefix: 'De Zéro à',
    heroTitleSuffix: 'Ingénieur IA.',
    heroDescription: 'Le cursus complet à coût zéro pour tous. Maîtrisez les réseaux de neurones, bases vectorielles, RAG et agents autonomes directement dans votre navigateur.',
    launchTrack0: 'Lancer Track 0',
    explorePathways: 'Explorer les Parcours',
    firstPrinciplesLabel: 'Premiers Principes du Programme • Cliquez pour Découvrir',
    exploreAllQuestions: 'Explorer les 15 Questions (Pourquoi • Comment • Qu’est-ce)',
    pathwaysHeading: 'Parcours d’Apprentissage Adaptatifs',
    pathwaysSubtitle: 'Chacun apprend différemment. Choisissez le parcours calibré selon votre profil.',
    freeStackHeading: 'Quatre Outils. Zéro Abonnement.',
    freeStackSubtitle: 'Pas besoin d’abonnements cloud onéreux pour devenir ingénieur en intelligence artificielle.',
    curriculumTitle: 'Architecture du Programme',
    curriculumSubtitle: 'Du Métal à l’Intelligence Neuronale',
    themePalette: 'Thèmes de Couleurs',
    enterBriefing: 'Voir le Briefing',
    synapseLoungeTitle: 'The Synapse Lounge',
    synapseLoungeSubtitle: 'Gymnastique Cognitive et Labo de Neuro-Plasticité • Aiguisez Votre Esprit',
    synapseLoungeDesc: 'L’étude technique intensive entraîne une fatigue cognitive. Les neurosciences prouvent que les jeux d’alignement spatial et de déduction logique favorisent la consolidation des connaissances.',
    whyPythonLabel: 'Pourquoi Python pour l’IA ?',
    whyWasmLabel: 'Pourquoi WASM Local ?',
    whyVectorLabel: 'Pourquoi les BD Vectorielles ?',
    whyRAGLabel: 'Pourquoi le RAG ?',
    whyZeroBudgetLabel: 'Pourquoi un Budget de 0$ ?'
  },
  de: {
    heroTag: '100% Kostenlos & Open Source',
    heroSubTag: 'Keine Programmierkenntnisse Erforderlich',
    heroTitlePrefix: 'Von Null zum',
    heroTitleSuffix: 'KI-Entwickler.',
    heroDescription: 'Das umfassende, kostenfreie Curriculum für alle. Meistern Sie neuronale Netze, Vektordatenbanken, RAG und autonome Agenten direkt im Browser.',
    launchTrack0: 'Track 0 Starten',
    explorePathways: 'Lernpfade Erkunden',
    firstPrinciplesLabel: 'Grundprinzipien des Curriculums • Klicken zum Aufklappen',
    exploreAllQuestions: 'Alle 15 Fragen erkunden (Warum • Wie • Was)',
    pathwaysHeading: 'Adaptive Lernpfade',
    pathwaysSubtitle: 'Jeder lernt anders. Wählen Sie den Pfad, der zu Ihrem Hintergrund passt.',
    freeStackHeading: 'Vier Werkzeuge. Null Abonnements.',
    freeStackSubtitle: 'Sie benötigen keine teuren Cloud-Abonnements, um KI-Entwickler zu werden.',
    curriculumTitle: 'Curriculum-Architektur',
    curriculumSubtitle: 'Von der Hardware zur Neuronalen Intelligenz',
    themePalette: 'Farbthemen',
    enterBriefing: 'Missions-Briefing',
    synapseLoungeTitle: 'The Synapse Lounge',
    synapseLoungeSubtitle: 'Kognitives Gym & Neuroplastizitäts-Labor • Schärfen Sie Ihren Geist',
    synapseLoungeDesc: 'Intensives technisches Lernen ermüdet das Arbeitsgedächtnis. Kognitionswissenschaftliche Studien zeigen, dass Denk- und Logikspiele die Wissenskonsolidierung im Diffuse Mode nachhaltig fördern.',
    whyPythonLabel: 'Warum Python für KI?',
    whyWasmLabel: 'Warum Lokales WASM?',
    whyVectorLabel: 'Warum Vektordatenbanken?',
    whyRAGLabel: 'Warum RAG?',
    whyZeroBudgetLabel: 'Warum 0$ Budget?'
  }
};

interface LanguageStoreState {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

export const useLanguageStore = create<LanguageStoreState>((set, get) => ({
  language: (localStorage.getItem('openguide_lang') as SupportedLanguage) || 'en',
  setLanguage: (lang: SupportedLanguage) => {
    localStorage.setItem('openguide_lang', lang);
    set({ language: lang });
  },
  t: (key: string) => {
    const lang = get().language;
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
  }
}));
