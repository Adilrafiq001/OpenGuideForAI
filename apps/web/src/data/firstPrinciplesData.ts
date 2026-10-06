export type QuestionCategory = 'why' | 'how' | 'what';

export interface FirstPrincipleQuestion {
  id: string;
  category: QuestionCategory;
  pillLabel: Record<string, string>;
  title: Record<string, string>;
  explanation: Record<string, string>;
  takeaway: Record<string, string>;
  tags: string[];
}

export const FIRST_PRINCIPLES_MATRIX: FirstPrincipleQuestion[] = [
  // --- WHY QUESTIONS ---
  {
    id: 'why-universal-ai-for-everyone',
    category: 'why',
    pillLabel: {
      en: 'AI for Everyone (0 to Expert)',
      es: 'IA para Todos (0 a Experto)',
      zh: 'AI 属于所有人（从零到专家）',
      hi: 'सभी के लिए एआई (0 से विशेषज्ञ)',
      fr: 'L’IA pour Tous (0 à Expert)',
      de: 'KI für alle (0 bis Experte)'
    },
    title: {
      en: 'Why AI is for All Humans: From Absolute Zero Knowledge to Frontier AI Experts',
      es: 'Por qué la IA es para todos los seres humanos: desde cero conocimiento hasta expertos de vanguardia',
      zh: '为什么 AI 属于全人类：从零认知普通人到前沿科研专家',
      hi: 'एआई सभी इंसानों के लिए क्यों है: शून्य ज्ञान से लेकर फ्रंटियर एआई विशेषज्ञ तक',
      fr: 'Pourquoi l’IA s’adresse à toute l’humanité : du néophyte absolu à l’expert de pointe',
      de: 'Warum KI für alle Menschen da ist: Vom absoluten Nullwissen bis zum Spitzenforscher'
    },
    explanation: {
      en: 'AI is not a gated country club for tech giants. A parent uses AI to explain math homework; a hair stylist uses it to automate booking reminders and protect color margins; a cobbler uses it to verify adhesive cure temperatures; a mechanical engineer uses it to verify thermal tolerances; a researcher uses it to derive scaled attention softmax gradients. OpenGuide was built to welcome every single learner across the entire spectrum.',
      es: 'La IA no es un club exclusivo para gigantes tecnológicos. Un padre la usa para explicar tareas escolares; un estilista para automatizar citas y calcular márgenes; un zapatero para tiempos de secado de adhesivos; un ingeniero para tolerancias térmicas; un investigador para gradientes de atención. OpenGuide acoge a todos los estudiantes en todo el espectro.',
      zh: 'AI 绝非科技巨头的封闭俱乐部。家长用它给孩子讲解数学作业；理发师用它自动化预约并核算染发利润；修鞋匠用它查询胶水固化温度；机械工程师用它复核热膨胀公差；科研专家用它推导自注意力梯度。OpenGuide 专为包容人类全知识光谱的每一位求知者而生。',
      hi: 'एआई तकनीकी दिग्गजों का बंद क्लब नहीं है। एक अभिभावक बच्चों को गणित समझाने के लिए इसका उपयोग करता है; एक सैलून स्टाइलिस्ट अपॉइंटमेंट और मुनाफे के लिए; एक मोची चमड़े के गोंद के लिए; एक मैकेनिकल इंजीनियर थर्मल टॉलरेंस के लिए; एक शोधकर्ता अटेंशन ग्रेडिएंट्स के लिए। OpenGuide सभी का स्वागत करता है।',
      fr: 'L’IA n’est pas un club fermé pour géants de la tech. Un parent l’utilise pour les devoirs, un coiffeur pour ses rappels de rendez-vous, un cordonnier pour le séchage des colles, un ingénieur pour les tolérances thermiques, un chercheur pour les gradients d’attention. OpenGuide accueille chaque profil.',
      de: 'KI ist kein elitärer Club für Tech-Konzerne. Eltern erklären damit Hausaufgaben, Friseure automatisieren Termine, Schuhmacher prüfen Klebstoff-Temperaturen, Ingenieure berechnen Wärmeausdehnungen und Forscher leiten Aufmerksamkeits-Gradienten ab. OpenGuide begrüßt jeden Menschen auf diesem Spektrum.'
    },
    takeaway: {
      en: 'AI is a universal human lever. You do not need to be an engineer to use it today.',
      es: 'La IA es una palanca universal para la humanidad. No necesitas ser ingeniero para usarla.',
      zh: 'AI 是全人类的通用杠杆。今天你无需任何工程背景即可从中获益。',
      hi: 'एआई एक सार्वभौमिक मानवीय उपकरण है। इसका उपयोग करने के लिए इंजीनियर होना जरूरी नहीं है।',
      fr: 'L’IA est un levier universel. Pas besoin d’être ingénieur pour en tirer profit dès aujourd’hui.',
      de: 'KI ist ein universeller Hebel für die Menschheit. Sie müssen kein Ingenieur sein, um sie zu nutzen.'
    },
    tags: ['Universal Access', 'Human Continuum', 'Zero Gatekeeping']
  },
  {
    id: 'what-is-ai-plain-english',
    category: 'what',
    pillLabel: {
      en: 'What is AI? (Zero Jargon)',
      es: '¿Qué es la IA? (Sin Jerga)',
      zh: '什么是 AI？（零术语白话）',
      hi: 'एआई क्या है? (सरल भाषा)',
      fr: 'Qu’est-ce que l’IA ? (Sans Jargon)',
      de: 'Was ist KI? (Ohne Fachchinesisch)'
    },
    title: {
      en: 'What is Artificial Intelligence in Plain English? (Zero Technical Jargon)',
      es: '¿Qué es la Inteligencia Artificial en lenguaje cotidiano? (Cero jerga técnica)',
      zh: '什么是人工智能？用最简单的日常大白话解释（零门槛）',
      hi: 'सरल भाषा में आर्टिफिशियल इंटेलिजेंस क्या है? (बिना किसी तकनीकी झंझट के)',
      fr: 'Qu’est-ce que l’intelligence artificielle en français simple ? (Zéro jargon technique)',
      de: 'Was ist künstliche Intelligenz in einfacher Sprache? (Völlig ohne Fachjargon)'
    },
    explanation: {
      en: 'AI is not a conscious thinking robot or magic brain. Think of it like a lightning-fast apprentice who has spent years reading billions of books, repair manuals, dictionaries, recipes, and conversations. When you ask it a question in normal everyday words, it looks at what you wrote and predicts the most logical, helpful answer based on patterns it learned.',
      es: 'La IA no es un robot consciente ni magia. Es como un aprendiz ultrarrápido que ha leído millones de libros, recetas y manuales. Cuando le hablas en palabras cotidianas, analiza tus palabras y predice la respuesta más útil y lógica.',
      zh: 'AI 绝非具有自我意识的机器人或魔法。把它想象成一个阅读过全世界数十亿本图书、维修手册、菜谱与对话的极速学徒。当你用日常说话的方式向它提问时，它会分析你的字句，并根据学到的海量规律推断出最合乎逻辑、最实用的解答。',
      hi: 'एआई कोई जीवित रोबोट या जादू नहीं है। इसे एक बेहद तेज़ शिक्षार्थी समझें जिसने दुनिया की अरबों किताबें, मैनुअल और बातचीत पढ़ी हैं। जब आप अपनी सामान्य भाषा में प्रश्न पूछते हैं, तो यह पैटर्न देखकर सबसे मददगार उत्तर देता है।',
      fr: 'L’IA n’est ni un robot conscient ni de la magie. Imaginez un apprenti surdoué ayant lu des milliards de livres et manuels. Lorsque vous lui posez une question simple, il prédit la réponse la plus utile d’après ses apprentissages.',
      de: 'KI ist weder ein Roboter mit Bewusstsein noch Zauberei. Stellen Sie sich einen blitzschnellen Lehrling vor, der Milliarden Bücher und Reparaturanleitungen gelesen hat. Auf Ihre alltäglichen Fragen antwortet er mit den hilfreichsten Mustern.'
    },
    takeaway: {
      en: 'AI predicts helpful words and solves problems using patterns. Talk to it like a kind friend.',
      es: 'La IA predice palabras útiles mediante patrones. Háblale como a un amigo atento.',
      zh: 'AI 通过模式规律预测实用文本并解决问题。你可以像与热心朋友交谈一样与它对话。',
      hi: 'एआई पैटर्न का उपयोग करके समस्याओं का समाधान करता है। इससे एक अच्छे मित्र की तरह बात करें।',
      fr: 'L’IA prédit des mots utiles et résout des problèmes grâce à des motifs. Parlez-lui comme à un ami.',
      de: 'KI erkennt Muster, um Probleme zu lösen. Sprechen Sie mit ihr wie mit einem hilfsbereiten Freund.'
    },
    tags: ['Foundations', 'Plain English', 'Beginners']
  },
  {
    id: 'what-is-llm-how-to-use',
    category: 'what',
    pillLabel: {
      en: 'You Are an LLM: How to Use Me',
      es: 'Eres un LLM: Cómo Usarme',
      zh: '你是 LLM：任何人该如何使用你',
      hi: 'आप LLM हैं: मेरा उपयोग कैसे करें',
      fr: 'Vous êtes un LLM : Comment m’utiliser',
      de: 'Du bist ein LLM: Wie man mich nutzt'
    },
    title: {
      en: 'You Are an LLM: What is an LLM and How Can Anyone Use You in the Simplest Way?',
      es: 'Eres un LLM: ¿Qué es un LLM y cómo puede usarlo cualquier persona de la forma más sencilla?',
      zh: '你是一个 LLM：什么是大语言模型？任何人如何以最简单的方式使用你？',
      hi: 'आप एक LLM हैं: LLM क्या है और कोई भी सबसे सरल तरीके से आपका उपयोग कैसे कर सकता है?',
      fr: 'Vous êtes un LLM : Qu’est-ce qu’un LLM et comment n’importe qui peut-il l’utiliser simplement ?',
      de: 'Du bist ein LLM: Was ist ein LLM und wie kann mich jeder auf einfachste Weise nutzen?'
    },
    explanation: {
      en: 'An LLM (Large Language Model) is a pattern-based language predictor. Just like your phone predicts your next word when texting, an LLM predicts the next helpful paragraphs across any topic. To use me, follow The 3 Golden Rules: 1. ROLE (Who to be): "Act as a friendly cooking assistant" or "Act as an experienced mechanic". 2. CONTEXT (What you have): "I have leftover rice, eggs, and frozen peas" or "My car makes a squeal when braking". 3. FORMAT (What to give): "Give me a 3-step dinner recipe" or "Give me the top 3 causes in bullet points".',
      es: 'Un LLM es un predictor de texto avanzado. Para usarlo fácilmente, sigue las 3 Reglas de Oro: 1. ROL (quién ser), 2. CONTEXTO (tus ingredientes o situación exacta), y 3. FORMATO (una lista de 3 pasos o viñetas simples).',
      zh: '大语言模型（LLM）是一个超强文本预测器。就像手机打字能猜下一个字一样，LLM 能预测下一段最实用的解答。任何人只需遵循三条黄金法则：1. 角色（我是谁）：如“扮演老厨师”或“扮演修车师傅”；2. 上下文（你有什么）：讲清材料或遇到的具体状况；3. 格式（你要什么）：明确说明要“3个步骤食谱”还是“简短清单”。',
      hi: 'LLM एक उन्नत टेक्स्ट प्रिडिक्टर है। इसका उपयोग करने के 3 सरल नियम हैं: 1. रोल (किसे बनना है - जैसे रसोइया या मैकेनिक), 2. संदर्भ (आपके पास क्या सामग्री या स्थिति है), 3. प्रारूप (आपको 3 चरणों की विधि चाहिए या बुलेट पॉइंट)।',
      fr: 'Un LLM prédit le texte utile. Pour l’utiliser sans difficulté, suivez les 3 Règles d’Or : 1. RÔLE (qui incarner), 2. CONTEXTE (votre situation ou ingrédients), et 3. FORMAT (une liste en 3 étapes claires).',
      de: 'Ein LLM ist ein intelligenter Textvorhersager. Nutzen Sie einfach die 3 Goldenen Regeln: 1. ROLLE (Wen ich spielen soll), 2. KONTEXT (Ihre Zutaten oder genaue Lage), 3. FORMAT (z. B. 3 einfache Schritte oder Aufzählungspunkte).'
    },
    takeaway: {
      en: 'The 3 Golden Rules: Role + Context + Format. Talk in plain English, and you will get great results every time.',
      es: 'Las 3 Reglas de Oro: Rol + Contexto + Formato. Habla con claridad y obtendrás resultados perfectos.',
      zh: '三条黄金法则：角色 + 上下文 + 期望格式。用普通话白话表达，每次都能得到精准解答。',
      hi: '3 सुनहरे नियम: रोल + संदर्भ + प्रारूप। सरल भाषा में बात करें और बेहतरीन परिणाम पाएं।',
      fr: 'Les 3 Règles d’Or : Rôle + Contexte + Format. Parlez simplement pour un résultat parfait.',
      de: 'Die 3 Goldenen Regeln: Rolle + Kontext + Format. Sprechen Sie normal, und Sie erhalten top Ergebnisse.'
    },
    tags: ['LLM', 'Prompting', '3 Golden Rules']
  },
  {
    id: 'is-ai-safe-and-free',
    category: 'why',
    pillLabel: {
      en: 'Is AI Safe & $0 Free?',
      es: '¿Es Seguro y Gratis?',
      zh: 'AI 安全且完全免费吗？',
      hi: 'क्या एआई सुरक्षित और ₹0 मुफ़्त है?',
      fr: 'L’IA est-elle Sûre et Gratuite ?',
      de: 'Ist KI sicher und kostenlos?'
    },
    title: {
      en: 'Is AI Really 100% Free and Safe? Can I Break Anything?',
      es: '¿La IA es realmente 100% gratuita y segura? ¿Puedo romper algo?',
      zh: 'AI 真的完全免费且安全吗？我会把电脑或手机弄坏吗？',
      hi: 'क्या एआई वास्तव में 100% मुफ़्त और सुरक्षित है? क्या मैं कुछ खराब कर सकता हूँ?',
      fr: 'L’IA est-elle vraiment 100% gratuite et sans danger ? Puis-je casser quelque chose ?',
      de: 'Ist KI wirklich 100% kostenlos und sicher? Kann ich etwas kaputt machen?'
    },
    explanation: {
      en: 'You cannot break anything! In OpenGuide, all Python code and learning modules run 100% inside your own web browser using WebAssembly. There are zero servers to break, zero subscriptions to pay, and no credit card is ever asked. If your code gets stuck in a loop, a built-in 15-second watchdog safely stops it. You have total safety, total privacy, and $0 cost forever.',
      es: '¡No puedes romper nada! En OpenGuide, todo el código se ejecuta dentro de tu navegador web mediante WebAssembly. No hay servidores que dañar ni tarjetas de crédito que ingresar. Cero costo y seguridad total.',
      zh: '你绝对不可能弄坏任何东西！在 OpenGuide 中，所有 Python 代码和学习实验都在你自己的浏览器内通过 WebAssembly 运行。没有云端服务器会损坏，完全不需要绑定信用卡，也没有任何付费陷阱。即便写错了死循环，15秒安全卫士也会自动终止。零费用、纯隐私、绝对安全。',
      hi: 'आप कुछ भी खराब नहीं कर सकते! OpenGuide में सारा कोड आपके ब्राउज़र में WebAssembly द्वारा चलता है। न कोई क्रेडिट कार्ड चाहिए, न कोई सर्वर खराब हो सकता है। यह 100% सुरक्षित और हमेशा ₹0 मुफ़्त है।',
      fr: 'Vous ne pouvez rien casser ! Dans OpenGuide, tout s’exécute dans votre propre navigateur via WebAssembly. Aucun serveur à endommager, aucune carte bancaire requise. Zéro coût et sécurité totale.',
      de: 'Sie können absolut nichts kaputt machen! In OpenGuide läuft der gesamte Code direkt in Ihrem Browser über WebAssembly. Es gibt keine Server zu beschädigen und keine Kreditkartenpflicht. 100% sicher und dauerhaft kostenlos.'
    },
    takeaway: {
      en: '100% safe, 100% private, and $0 forever. You cannot break anything by exploring.',
      es: '100% seguro, privado y $0 para siempre. No puedes romper nada explorando.',
      zh: '100% 安全、隐私且永久 $0 免费。大胆探索，没有任何可以弄坏的东西。',
      hi: '100% सुरक्षित, निजी और हमेशा मुफ़्त। प्रयोग करने से कुछ भी ख़राब नहीं होगा।',
      fr: '100% sûr, privé et gratuit pour toujours. Vous ne risquez rien en explorant.',
      de: '100% sicher, privat und für immer kostenlos. Sie können beim Entdecken nichts beschädigen.'
    },
    tags: ['Safety', 'No Fear', '$0 Cost']
  },
  {
    id: 'why-python',
    category: 'why',
    pillLabel: {
      en: 'Why Python for AI?',
      es: '¿Por qué Python para IA?',
      zh: '为什么 AI 首选 Python？',
      hi: 'एआई के लिए पायथन क्यों?',
      fr: 'Pourquoi Python pour l’IA ?',
      de: 'Warum Python für KI?'
    },
    title: {
      en: 'Why Python is the Global Lingua Franca of Artificial Intelligence',
      es: 'Por qué Python es el estándar global de la Inteligencia Artificial',
      zh: '为什么 Python 成为全球人工智能的标准通用语言',
      hi: 'पायथन आर्टिफिशियल इंटेलिजेंस का वैश्विक मानक क्यों है',
      fr: 'Pourquoi Python est le langage standard de l’intelligence artificielle',
      de: 'Warum Python die weltweite Standardsprache für KI ist'
    },
    explanation: {
      en: 'Every frontier research organization (OpenAI, DeepMind, Meta, Anthropic) builds their core deep learning libraries (PyTorch, Hugging Face, Transformers) in Python. Its clean, pseudocode-like syntax eliminates memory-allocation boilerplate so you can focus entirely on intelligence architecture, tensor shapes, and cognitive loops.',
      es: 'Todos los laboratorios de vanguardia (OpenAI, DeepMind, Meta) construyen sus bibliotecas (PyTorch, Hugging Face) en Python. Su sintaxis clara permite concentrarse en la arquitectura del modelo sin lidiar con la gestión manual de memoria.',
      zh: '所有前沿研究机构（OpenAI、DeepMind、Meta）的核心框架（PyTorch、Hugging Face、Transformers）均采用 Python。其如同伪代码般优雅的语法消除了底层内存管理的繁琐，让您全心专注于智能架构与张量计算。',
      hi: 'सभी प्रमुख शोध संस्थान (OpenAI, DeepMind, Meta) अपने कोर फ्रेमवर्क (PyTorch, Hugging Face) पायथन में लिखते हैं। इसकी सरल और स्पष्ट सिंटैक्स जटिल मेमोरी प्रबंधन से मुक्त रखती है, जिससे आप पूरी तरह से न्यूरल नेटवर्क और मॉडल आर्किटेक्चर पर ध्यान केंद्रित कर सकते हैं।',
      fr: 'Tous les laboratoires de pointe conçoivent leurs bibliothèques en Python. Sa syntaxe fluide élimine les contraintes de bas niveau pour vous permettre de vous concentrer sur l’architecture cognitive.',
      de: 'Alle führenden Forschungsteams entwickeln ihre Kern-Frameworks in Python. Die klare Syntax befreit Sie von manuellem Speichermanagement, damit Sie sich auf kognitive Architekturen konzentrieren können.'
    },
    takeaway: {
      en: 'Python acts as the friendly, high-level steering wheel for deep neural compute.',
      es: 'Python actúa como el volante accesible para el cómputo neuronal profundo.',
      zh: 'Python 是驾驭底层高性能深度神经网络的最友好方向盘。',
      hi: 'पायथन गहरे न्यूरल कंप्यूट को आसानी से नियंत्रित करने वाला सुगम स्टीयरिंग व्हील है।',
      fr: 'Python est le volant haute performance et accessible du calcul neuronal profond.',
      de: 'Python ist das intuitive Steuer für hochkomplexe neuronale Berechnungen.'
    },
    tags: ['Ecosystem', 'Syntax', 'Industry Standard']
  },
  {
    id: 'why-local-wasm',
    category: 'why',
    pillLabel: {
      en: 'Why In-Browser WASM?',
      es: '¿Por qué WASM en Navegador?',
      zh: '为什么使用浏览器端 WASM？',
      hi: 'ब्राउज़र WASM क्यों?',
      fr: 'Pourquoi WASM dans le Navigateur ?',
      de: 'Warum In-Browser WASM?'
    },
    title: {
      en: 'Why In-Browser WebAssembly Beats Remote Cloud Containers',
      es: 'Por qué WebAssembly en el navegador supera a los servidores en la nube',
      zh: '为什么浏览器端 WebAssembly 远胜远程云端容器',
      hi: 'ब्राउज़र-आधारित WebAssembly रिमोट क्लाउड सर्वर से बेहतर क्यों है',
      fr: 'Pourquoi WebAssembly dans le navigateur surpasse les conteneurs cloud',
      de: 'Warum WebAssembly im Browser entfernten Cloud-Servern überlegen ist'
    },
    explanation: {
      en: 'Traditional coding bootcamps spin up expensive cloud servers that cost monthly fees and time out after inactivity. OpenGuide compiles official CPython into WebAssembly (Pyodide), running code directly on your local device CPU cores inside a Web Worker. You get instant 0ms latency, offline capability, complete data privacy, and zero server hosting bills.',
      es: 'En lugar de pagar servidores en la nube que expiran, OpenGuide compila CPython oficial en WebAssembly dentro de tu navegador. Obtienes 0ms de latencia, privacidad total y cero facturas de hosting.',
      zh: '传统的在线编程平台需要租用昂贵且容易超时的云端服务器。OpenGuide 将官方 CPython 编译为 WebAssembly（Pyodide），在独立的 Web Worker 中直接调用您本地设备的 CPU 核心运算。零延迟、支持离线、完全隐私且零云端账单。',
      hi: 'पारंपरिक प्लेटफ़ॉर्म महंगे क्लाउड सर्वर किराए पर लेते हैं जो बार-बार टाइमआउट होते हैं। OpenGuide आधिकारिक CPython को सीधे आपके डिवाइस के CPU पर WebAssembly के माध्यम से निष्पादित करता है। आपको 0ms लेटेंसी, संपूर्ण गोपनीयता और ₹0 सर्वर बिल मिलता है।',
      fr: 'Au lieu de louer des serveurs distants, OpenGuide exécute CPython directement sur vos cœurs CPU via WebAssembly. Zéro latence, confidentialité totale et aucun coût d’hébergement.',
      de: 'Anstatt teure Cloud-Server zu mieten, kompiliert OpenGuide CPython direkt in WebAssembly auf Ihrer lokalen CPU. 0ms Latenz, absolute Privatsphäre und null laufende Kosten.'
    },
    takeaway: {
      en: 'Zero setup friction, zero credit card requirements, and zero risk of surprise cloud bills.',
      es: 'Sin configuraciones complejas, sin tarjetas de crédito y sin sorpresas de facturación.',
      zh: '免繁琐环境配置，无需绑定信用卡，彻底杜绝意外扣费风险。',
      hi: 'शून्य इंस्टॉलेशन झंझट, शून्य क्रेडिट कार्ड आवश्यकता, और बिना किसी अप्रत्याशित बिल का डर।',
      fr: 'Aucune installation complexe, aucune carte bancaire requise, aucun risque de frais imprévus.',
      de: 'Keine Installationshürden, keine Kreditkarte nötig und kein Risiko unvorhergesehener Kosten.'
    },
    tags: ['Architecture', 'Privacy', '$0 Cost']
  },
  {
    id: 'why-vector-db',
    category: 'why',
    pillLabel: {
      en: 'Why Vector Databases?',
      es: '¿Por qué BD Vectoriales?',
      zh: '为什么需要向量数据库？',
      hi: 'वेक्टर डेटाबेस क्यों?',
      fr: 'Pourquoi les BD Vectorielles ?',
      de: 'Warum Vektordatenbanken?'
    },
    title: {
      en: 'Why AI Needs Vector Databases Instead of Relational SQL',
      es: 'Por qué la IA necesita bases de datos vectoriales en lugar de SQL tradicional',
      zh: '为什么人工智能需要向量数据库而非传统关系型 SQL',
      hi: 'एआई को पारंपरिक SQL के बजाय वेक्टर डेटाबेस की आवश्यकता क्यों है',
      fr: 'Pourquoi l’IA a besoin de bases vectorielles plutôt que de bases SQL classiques',
      de: 'Warum KI Vektordatenbanken statt herkömmlicher SQL-Datenbanken benötigt'
    },
    explanation: {
      en: 'Relational databases match literal character strings: a search for "physician" will never match "doctor" unless manually aliased. Vector databases project language into high-dimensional geometric space where conceptual synonyms cluster close together. An AI can retrieve concepts by contextual meaning, tone, and intent rather than exact spelling.',
      es: 'Las bases de datos SQL buscan coincidencias exactas de palabras. Las bases vectoriales proyectan el lenguaje en un espacio geométrico donde los conceptos similares se agrupan por significado y cercanía conceptual.',
      zh: '关系型数据库只能按字面字符完全匹配（搜索“大夫”若无映射则找不到“医生”）。向量数据库将自然语言投射到高维几何坐标系中，语义相近的概念彼此相邻。AI 可以凭借语境、意图和概念内涵实现毫秒级精准检索。',
      hi: 'पारंपरिक SQL डेटाबेस केवल सटीक शब्दों का मिलान करते हैं। वेक्टर डेटाबेस भाषा को उच्च-आयामी ज्यामितीय स्थान में बदलते हैं जहाँ "चिकित्सक" और "डॉक्टर" स्वाभाविक रूप से निकटतम निर्देशांक साझा करते हैं।',
      fr: 'Les bases SQL recherchent des mots exacts. Les bases vectorielles projettent le langage dans un espace géométrique où les concepts proches se regroupent par sens et intention.',
      de: 'Herkömmliche SQL-Datenbanken prüfen nur genaue Zeichenketten. Vektordatenbanken projizieren Sprache in einen geometrischen Raum, in dem sinngleiche Begriffe räumlich beieinander liegen.'
    },
    takeaway: {
      en: 'Vector databases provide artificial intelligence with long-term associative memory.',
      es: 'Las bases vectoriales proporcionan a la IA una memoria asociativa a largo plazo.',
      zh: '向量数据库为大型语言模型赋予了永不遗忘的长效联想记忆力。',
      hi: 'वेक्टर डेटाबेस आर्टिफिशियल इंटेलिजेंस को दीर्घकालिक सहयोगी स्मृति (मेमोरी) प्रदान करते हैं।',
      fr: 'Les bases vectorielles offrent à l’IA une véritable mémoire associative à long terme.',
      de: 'Vektordatenbanken verleihen künstlicher Intelligenz ein dauerhaftes assoziatives Gedächtnis.'
    },
    tags: ['Memory', 'Embeddings', 'Search']
  },
  {
    id: 'why-rag',
    category: 'why',
    pillLabel: {
      en: 'Why RAG (Retrieval-Augmented)?',
      es: '¿Por qué RAG?',
      zh: '为什么必须使用 RAG？',
      hi: 'RAG क्यों आवश्यक है?',
      fr: 'Pourquoi le RAG ?',
      de: 'Warum RAG?'
    },
    title: {
      en: 'Why Retrieval-Augmented Generation Beats Costly Model Fine-Tuning',
      es: 'Por qué RAG supera al costoso ajuste fino (fine-tuning) de modelos',
      zh: '为什么检索增强生成（RAG）远胜成本高昂的微调（Fine-Tuning）',
      hi: 'रिट्रीवल-ऑगमेंटेड जेनरेशन (RAG) महंगे मॉडल फाइन-ट्यूनिंग से बेहतर क्यों है',
      fr: 'Pourquoi la génération augmentée par récupération (RAG) surpasse le fine-tuning coûteux',
      de: 'Warum Retrieval-Augmented Generation (RAG) teures Fine-Tuning übertrifft'
    },
    explanation: {
      en: 'Fine-tuning a billion-parameter model requires immense GPU hours and freezes static knowledge that becomes obsolete the moment training stops. RAG dynamically fetches verified, private documents from your vector store at prompt time, injecting exact factual citations into the model context with zero training cost.',
      es: 'El ajuste fino cuesta miles de dólares y congela el conocimiento en el tiempo. RAG busca dinámicamente documentos reales y privados al momento de la consulta, inyectando hechos verificables con citas exactas a costo cero.',
      zh: '微调数十亿参数的模型需要消耗数千美元的高昂 GPU 算力，且知识在训练完成那一刻即开始过时。RAG 在提问发生的一瞬间，从您的私有向量库中精确检索最新事实并注入提示词，零训练成本、实时更新且具备可溯源的参考引用。',
      hi: 'मॉडल को फाइन-ट्यून करने में भारी GPU लागत आती है और ज्ञान उसी क्षण पुराना हो जाता है। RAG वास्तविक समय में आपके निजी दस्तावेज़ों को खोजकर मॉडल के प्रॉम्प्ट में सटीक तथ्य और संदर्भ जोड़ता है।',
      fr: 'Le fine-tuning immobilise des connaissances qui deviennent rapidement obsolètes. Le RAG extrait dynamiquement vos documents privés à chaque requête, assurant une précision factuelle sans frais.',
      de: 'Fine-Tuning erfordert enorme Rechenzeit und veraltet sofort. RAG ruft dynamisch verifizierte, private Dokumente zum Abfragezeitpunkt ab und liefert exakte Belege ohne Trainingskosten.'
    },
    takeaway: {
      en: 'RAG connects frozen neural models to live, private, and continuously updated truth.',
      es: 'RAG conecta modelos congelados con información privada y actualizada en tiempo real.',
      zh: 'RAG 将静态预训练模型与实时、私有且持续更新的客观真实知识无缝连通。',
      hi: 'RAG स्थिर न्यूरल मॉडल को वास्तविक समय के निजी और अद्यतन ज्ञान से जोड़ता है।',
      fr: 'Le RAG relie les modèles statiques à une source de vérité vivante, privée et vérifiée.',
      de: 'RAG verbindet starre Modelle mit lebendigen, privaten und aktuellen Fakten.'
    },
    tags: ['Architecture', 'Hallucination Prevention', 'Production']
  },
  {
    id: 'why-zero-dollar',
    category: 'why',
    pillLabel: {
      en: 'Why $0 Budget Stack?',
      es: '¿Por qué Presupuesto $0?',
      zh: '为什么坚持 $0 预算技术栈？',
      hi: '$0 बजट स्टैक क्यों?',
      fr: 'Pourquoi un Budget de 0$ ?',
      de: 'Warum ein 0$-Budget-Stack?'
    },
    title: {
      en: 'Why You Never Need Paid Subscriptions to Become an AI Engineer',
      es: 'Por qué no necesitas suscripciones de pago para convertirte en Ingeniero de IA',
      zh: '为什么您无需任何付费订阅即可成为一名顶尖 AI 工程师',
      hi: 'एआई इंजीनियर बनने के लिए आपको कभी भी पेड सब्सक्रिप्शन की आवश्यकता क्यों नहीं है',
      fr: 'Pourquoi aucun abonnement payant n’est nécessaire pour devenir ingénieur IA',
      de: 'Warum Sie keine kostenpflichtigen Abos brauchen, um KI-Entwickler zu werden'
    },
    explanation: {
      en: 'Commercial vendors want you locked into $20/month subscriptions before you understand foundational math. The modern open-source ecosystem provides free T4 GPUs (Google Colab / Kaggle 30h/wk), free production hosting (Hugging Face Spaces), free vector search (Chroma / Qdrant Free), and local browser runtimes (Pyodide). You can build a world-class portfolio without spending a dime.',
      es: 'El ecosistema de código abierto te brinda GPUs T4 gratis (Colab/Kaggle), hosting público gratuito (Hugging Face Spaces) y bases vectoriales gratuitas. Puedes construir un portafolio profesional completo sin gastar un centavo.',
      zh: '商业软件公司总希望在您掌握底层原理前诱导订阅。当今开源生态提供了免费的 T4 GPU 算力（Colab 与 Kaggle 每周 30 小时）、免费公共托管服务（Hugging Face Spaces）、免费向量索引（Chroma）以及本地运行环境。在真正接到付费商业项目之前，您不应花费哪怕一分钱。',
      hi: 'वाणिज्यिक कंपनियाँ आपको महंगे सब्सक्रिप्शन में बाँधना चाहती हैं। खुला स्रोत पारिस्थितिकी तंत्र मुफ्त T4 GPU (Google Colab / Kaggle), मुफ्त पब्लिक होस्टिंग (Hugging Face Spaces) और स्थानीय पायथन प्रदान करता है। आप ₹0 खर्च करके विश्वस्तरीय पोर्टफोलियो बना सकते हैं।',
      fr: 'L’écosystème open-source met à disposition des GPU T4 gratuits, un hébergement public sans frais et des moteurs vectoriels locaux. Développez un portfolio complet sans débourser un centime.',
      de: 'Das Open-Source-Ökosystem bietet kostenlose T4-GPUs, freies Hosting und lokale Vektorspeicher. Sie können ein vollwertiges Portfolio aufbauen, ohne einen einzigen Cent auszugeben.'
    },
    takeaway: {
      en: 'Spend $0 on AI tools until an enterprise or client pays you for your code.',
      es: 'Gasta $0 en herramientas de IA hasta que una empresa o cliente te pague por tu trabajo.',
      zh: '在企业或真实客户为您的工程代码付费前，在工具上保持 $0 支出。',
      hi: 'जब तक कोई कॉर्पोरेट ग्राहक आपके काम के लिए भुगतान न करे, तब तक टूल्स पर ₹0 खर्च करें।',
      fr: 'Dépensez 0$ en outils d’IA tant qu’un client ne vous rémunère pas pour votre travail.',
      de: 'Geben Sie 0$ für KI-Tools aus, bis ein zahlender Kunde Sie für Ihren Code entlohnt.'
    },
    tags: ['Career', 'Open Source', 'Bootstrapping']
  },

  // --- HOW QUESTIONS ---
  {
    id: 'how-wasm-executes',
    category: 'how',
    pillLabel: {
      en: 'How does WASM execute Python?',
      es: '¿Cómo ejecuta WASM a Python?',
      zh: 'WASM 如何在浏览器运行 Python？',
      hi: 'WASM पायथन कैसे चलाता है?',
      fr: 'Comment WASM exécute Python ?',
      de: 'Wie führt WASM Python aus?'
    },
    title: {
      en: 'How WebAssembly Executes Native CPython Inside the Browser Engine',
      es: 'Cómo WebAssembly ejecuta CPython nativo dentro del motor del navegador',
      zh: 'WebAssembly 如何在浏览器内核中直接执行原生 CPython',
      hi: 'WebAssembly ब्राउज़र इंजन के अंदर नेटिव CPython को कैसे निष्पादित करता है',
      fr: 'Comment WebAssembly exécute le CPython natif dans le moteur du navigateur',
      de: 'Wie WebAssembly natives CPython direkt im Browser ausführt'
    },
    explanation: {
      en: 'CPython (the reference implementation of Python written in C) is compiled using Emscripten into WebAssembly binary instructions (.wasm). When you load OpenGuide, a background Web Worker boots this interpreter and allocates a virtual RAM heap. Code you type is parsed, compiled to bytecode, and evaluated entirely on your physical CPU threads without contacting any remote server.',
      es: 'El código C de CPython se compila en instrucciones binarias WebAssembly (.wasm). Un Web Worker en segundo plano inicia este intérprete y asigna memoria RAM virtual en tu máquina, evaluando tu código directamente en los núcleos de tu CPU.',
      zh: 'CPython（C 语言编写的官方参考实现）通过 Emscripten 编译器被转换成 WebAssembly 二进制指令集（.wasm）。OpenGuide 启动一个后台 Web Worker 加载解释器并开辟虚拟内存堆。您键入的代码在本地 CPU 核心上完成解析、编译和执行，完全不需要向任何远程服务器发送代码。',
      hi: 'CPython (C भाषा में लिखा गया मुख्य पायथन) Emscripten द्वारा WebAssembly बाइनरी (.wasm) में संकलित किया जाता है। एक बैकग्राउंड वेब वर्कर इस इंटरप्रेटर को शुरू करता है और आपके कंप्यूटर के CPU पर कोड चलाता है।',
      fr: 'Le code CPython est compilé en instructions binaires WebAssembly (.wasm). Un Web Worker en arrière-plan lance cet interpréteur et exécute votre code directement sur vos processeurs locaux.',
      de: 'CPython wird mittels Emscripten in WebAssembly-Binärcode kompiliert. Ein Web Worker startet diesen Interpreter und führt Ihren Code direkt auf den Kernen Ihrer CPU aus.'
    },
    takeaway: {
      en: 'True native Python execution sandboxed within the safety of your web browser.',
      es: 'Ejecución real de Python nativo protegida dentro del entorno de tu navegador.',
      zh: '在现代浏览器的安全沙箱内获得完全原生的真实 Python 解释执行能力。',
      hi: 'आपके वेब ब्राउज़र की सुरक्षा के भीतर वास्तविक नेटिव पायथन निष्पादन।',
      fr: 'Une exécution Python authentique et isolée dans la sécurité de votre navigateur.',
      de: 'Echtes, natives Python – isoliert und sicher direkt in Ihrem Webbrowser.'
    },
    tags: ['WASM', 'Web Worker', 'Compilers']
  },
  {
    id: 'how-embeddings-work',
    category: 'how',
    pillLabel: {
      en: 'How do Embeddings capture meaning?',
      es: '¿Cómo capturan significado los Embeddings?',
      zh: '向量嵌入如何捕捉语义？',
      hi: 'एम्बेडिंग्स अर्थ कैसे पकड़ते हैं?',
      fr: 'Comment les Embeddings capturent le sens ?',
      de: 'Wie erfassen Embeddings Bedeutung?'
    },
    title: {
      en: 'How Neural Embedding Models Convert Human Thoughts into Geometry',
      es: 'Cómo los modelos neuronales convierten ideas humanas en coordenadas geométricas',
      zh: '神经网络嵌入模型如何将人类思维与语言转化为高维空间几何坐标',
      hi: 'न्यूरल एम्बेडिंग मॉडल मानवीय विचारों को ज्यामिति में कैसे बदलते हैं',
      fr: 'Comment les modèles d’embeddings transforment la pensée humaine en géométrie',
      de: 'Wie neuronale Embedding-Modelle menschliche Gedanken in Geometrie umwandeln'
    },
    explanation: {
      en: 'An embedding model processes a string of text and outputs a dense vector of floating-point numbers (e.g., 768 or 1536 coordinates). Words used in similar contexts receive similar coordinates. The famous equation "Vector(King) - Vector(Man) + Vector(Woman) = Vector(Queen)" proves that semantic relationships like gender, tense, and status become geometric vectors with measurable distance and direction.',
      es: 'Un modelo de embeddings convierte texto en un vector de números (ej. 768 dimensiones). La famosa ecuación "Rey - Hombre + Mujer = Reina" demuestra que el significado se convierte en trayectorias medibles en el espacio.',
      zh: '嵌入模型读取文本并输出一组由数百甚至数千个浮点数组成的高维向量（例如 768 或 1536 维坐标）。在相似语境下出现的词汇会获得相近的坐标方向。著名的矢量运算法则“向量(国王) - 向量(男人) + 向量(女人) ≈ 向量(女王)”证明了性别、时态与社会属性都可以被精确量化为几何空间中的位移。',
      hi: 'एम्बेडिंग मॉडल टेक्स्ट को 768 या 1536 संख्याओं के वेक्टर में बदलता है। "वेक्टर(राजा) - वेक्टर(पुरुष) + वेक्टर(महिला) ≈ वेक्टर(रानी)" समीकरण दर्शाता है कि भाषा का अर्थ ज्यामितीय दिशा और दूरी बन जाता है।',
      fr: 'Un modèle d’embedding convertit un texte en un vecteur de nombres réels. L’équation « Roi - Homme + Femme = Reine » illustre comment le sens devient une trajectoire géométrique mesurable.',
      de: 'Ein Embedding-Modell wandelt Text in hochdimensionale Vektoren um. Die bekannte Gleichung „König - Mann + Frau = Königin“ beweist, dass Bedeutung zu messbaren geometrischen Vektoren wird.'
    },
    takeaway: {
      en: 'Cosine similarity calculates the angular distance between thoughts: 1.0 = identical, 0.0 = orthogonal.',
      es: 'La similitud de coseno mide el ángulo entre ideas: 1.0 = idéntico, 0.0 = ortogonal.',
      zh: '余弦相似度（Cosine Similarity）通过计算两个向量夹角的大小量化语义关联：1.0 代表完全同义，0.0 代表毫无关联。',
      hi: 'कोसाइन समानता विचारों के बीच कोणीय दूरी मापती है: 1.0 = समान, 0.0 = असंबंधित।',
      fr: 'La similarité cosinus mesure l’angle entre les pensées : 1.0 = identique, 0.0 = sans rapport.',
      de: 'Kosinus-Ähnlichkeit misst den Winkel zwischen Gedanken: 1.0 = identisch, 0.0 = unabhängig.'
    },
    tags: ['Vector Space', 'Math', 'Linear Algebra']
  },
  {
    id: 'how-agents-decide',
    category: 'how',
    pillLabel: {
      en: 'How do AI Agents make decisions?',
      es: '¿Cómo toman decisiones los Agentes de IA?',
      zh: 'AI 智能体如何做自主决策？',
      hi: 'एआई एजेंट निर्णय कैसे लेते हैं?',
      fr: 'Comment les agents IA décident-ils ?',
      de: 'Wie treffen KI-Agenten Entscheidungen?'
    },
    title: {
      en: 'The ReAct Loop: How Autonomous Agents Combine Reasoning and Action',
      es: 'El ciclo ReAct: cómo los agentes autónomos combinan razonamiento y acción',
      zh: 'ReAct 循环架构：自主智能体如何将逻辑推理与外部工具行动完美结合',
      hi: 'ReAct लूप: स्वायत्त एजेंट तर्क और क्रिया को कैसे जोड़ते हैं',
      fr: 'La boucle ReAct : comment les agents autonomes combinent raisonnement et action',
      de: 'Der ReAct-Loop: Wie autonome Agenten Denken und Handeln verbinden'
    },
    explanation: {
      en: 'An LLM alone is just a static text generator with no hands. An Autonomous Agent wraps the model in a stateful loop known as ReAct: 1) THOUGHT: The model analyzes the current user goal. 2) ACTION: It calls a designated tool (API, Python interpreter, database query). 3) OBSERVATION: It receives and parses the real tool output. 4) REFLECTION: It decides whether to take another action or respond to the user.',
      es: 'Un agente autónomo envuelve el modelo en un ciclo continuo: 1) Razona sobre el objetivo, 2) Ejecuta una herramienta externa (API, código Python), 3) Observa los resultados reales, y 4) Decide el siguiente paso hasta completar la tarea.',
      zh: '单纯的大语言模型只是一个没有四肢的文本预测器。自主智能体（Agent）将其包裹在一个被称为 ReAct 的状态循环中：1) 思考（Thought）：分析当前目标并制定策略；2) 行动（Action）：调用外部工具（API、计算器、Python 执行器）；3) 观察（Observation）：读取工具返回的真实结果；4) 迭代（Loop）：评估任务完成度，直到产出最终答复。',
      hi: 'एक अकेला LLM केवल टेक्स्ट जनरेटर है। एक स्वायत्त एजेंट मॉडल को ReAct लूप में रखता है: 1) सोचना (Thought), 2) टूल चलाना (Action), 3) परिणाम देखना (Observation), और 4) लक्ष्य पूरा होने तक प्रक्रिया दोहराना।',
      fr: 'Un agent autonome enveloppe le modèle dans une boucle ReAct : 1) Réflexion sur l’objectif, 2) Action via un outil externe, 3) Observation du résultat, et 4) Décision jusqu’à l’accomplissement.',
      de: 'Ein autonomer Agent bettet das Sprachmodell in eine ReAct-Schleife ein: 1) Ziel analysieren (Gedanke), 2) Werkzeug aufrufen (Aktion), 3) Rückgabe prüfen (Beobachtung) und 4) wiederholen bis zum Ziel.'
    },
    takeaway: {
      en: 'Tools give the model hands; the ReAct loop gives the model executive function.',
      es: 'Las herramientas le dan manos al modelo; el ciclo ReAct le proporciona función ejecutiva.',
      zh: '工具赋予了大语言模型与世界交互的“双手”，而 ReAct 循环则赋予了它执行大脑的“决断力”。',
      hi: 'उपकरण (टूल्स) मॉडल को कार्य करने के हाथ देते हैं; ReAct लूप उसे विवेकपूर्ण निर्णय क्षमता प्रदान करता है।',
      fr: 'Les outils donnent des mains au modèle ; la boucle ReAct lui confère une fonction exécutive.',
      de: 'Werkzeuge verleihen dem Modell Hände; die ReAct-Schleife verleiht ihm Handlungsfähigkeit.'
    },
    tags: ['Agents', 'ReAct', 'Tool Calling']
  },

  // --- WHAT QUESTIONS ---
  {
    id: 'what-is-ai-plain-english',
    category: 'what',
    pillLabel: {
      en: 'What is AI in Plain English?',
      es: '¿Qué es la IA en lenguaje simple?',
      zh: '大白话讲透：什么是 AI？',
      hi: 'सरल भाषा में एआई क्या है?',
      fr: 'Qu’est-ce que l’IA en clair ?',
      de: 'Was ist KI auf den Punkt gebracht?'
    },
    title: {
      en: 'What Exactly is Artificial Intelligence? (Demystifying the Hype)',
      es: 'Qué es exactamente la Inteligencia Artificial: desmitificando la exageración',
      zh: '人工智能究竟是什么？褪去神话与炒作的客观底层认知',
      hi: 'आर्टिफिशियल इंटेलिजेंस वास्तव में क्या है? बिना किसी आडंबर के समझें',
      fr: 'Qu’est-ce que l’intelligence artificielle exactement ? Démystifier le mythe',
      de: 'Was genau ist Künstliche Intelligenz? Fakten statt Hype'
    },
    explanation: {
      en: 'AI is not a conscious robot, a living mind, or magic. Think of it as a lightning-fast apprentice that has read billions of books, repair manuals, dictionaries, and conversations. When you ask it a question, it finds the underlying patterns and predicts the most helpful, logical answer. You speak to it in plain everyday words, and in OpenGuide, it is 100% free with zero software downloads.',
      es: 'La IA no es un robot consciente ni magia. Es como un aprendiz ultrarrápido que ha leído millones de libros, recetas y manuales. Cuando preguntas algo, reconoce patrones y predice la respuesta más útil en lenguaje natural.',
      zh: 'AI 既不是有意识的科幻机器人，更不是魔法。将其想象为一个不知疲倦的高速学徒，读遍了人类历史上的数百万本书籍、操作手册、字典和真实对话。当你向它提问时，它根据学到的统计规律预测出最符合逻辑、最有帮助的回答。你只需用平实的日常语言与它对话即可。',
      hi: 'एआई कोई जादुई रोबोट या जीवित मस्तिष्क नहीं है। इसे एक बेहद फुर्तीले शिक्षार्थी की तरह समझें जिसने दुनिया की लाखों किताबें, मैनुअल और बातचीत पढ़ी हैं। जब आप कोई प्रश्न पूछते हैं, तो यह पैटर्न पहचानकर सबसे उपयोगी उत्तर तैयार करता है। आप इससे साधारण भाषा में बात कर सकते हैं।',
      fr: 'L’IA n’est ni un robot conscient ni de la magie. Imaginez un apprenti ultra-rapide qui a lu des milliards de livres et manuels. Lorsque vous l’interrogez, il prédit la réponse la plus logique et utile en langage clair.',
      de: 'KI ist kein denkender Roboter und keine Magie. Man kann sie sich wie einen blitzschnellen Lehrling vorstellen, der Millionen Bücher und Anleitungen gelesen hat. Bei einer Frage erkennt er Muster und formuliert die hilfreichste Antwort in ganz normaler Sprache.'
    },
    takeaway: {
      en: 'AI is a pattern-matching helper that understands normal human language, with zero magic.',
      es: 'La IA es un asistente de patrones que comprende el lenguaje humano normal, sin trucos ni magia.',
      zh: 'AI 是一个能够深刻理解人类日常语言的统计模式匹配助手，绝无任何神秘虚妄。'
      ,hi: 'एआई एक पैटर्न-मैचिंग सहायक है जो सामान्य मानवीय भाषा को समझता है, इसमें कोई रहस्य नहीं है।',
      fr: 'L’IA est un assistant d’analyse de motifs qui comprend le langage humain naturel, sans magie.',
      de: 'KI ist ein Mustererkennungs-Assistent, der normale menschliche Sprache versteht – ohne jede Magie.'
    },
    tags: ['Fundamentals', 'Beginners', 'Mental Model']
  },
  {
    id: 'what-is-llm-how-to-use',
    category: 'what',
    pillLabel: {
      en: 'What is an LLM & How to Use It?',
      es: '¿Qué es un LLM y cómo usarlo?',
      zh: '什么是 LLM 以及如何高效使用？',
      hi: 'LLM क्या है और इसका उपयोग कैसे करें?',
      fr: 'Qu’est-ce qu’un LLM et comment l’utiliser ?',
      de: 'Was ist ein LLM und wie nutzt man es?'
    },
    title: {
      en: 'What is a Large Language Model and the 3 Golden Rules to Use It',
      es: 'Qué es un Gran Modelo de Lenguaje y las 3 Reglas de Oro para usarlo',
      zh: '什么是大语言模型（LLM）？掌握人机协作的 3 条黄金法则',
      hi: 'लार्ज लैंग्वेज मॉडल क्या है और इसका उपयोग करने के 3 सुनहरे नियम',
      fr: 'Qu’est-ce qu’un modèle de langage (LLM) et les 3 règles d’or pour l’utiliser',
      de: 'Was ist ein großes Sprachmodell (LLM) und die 3 goldenen Regeln der Nutzung'
    },
    explanation: {
      en: 'Just like your phone keyboard suggests the next word when you type an SMS, a Large Language Model (LLM) predicts the next words to complete your thoughts—scaled across thousands of subjects. To get great results, remember the 3 Golden Rules: 1. Give it a Role ("Act as a master shoe repairer"), 2. Give it the Context ("I have oily pull-up leather and Vibram soles"), and 3. Specify the Format ("Give me a 3-step checklist in simple words").',
      es: 'Igual que tu teléfono predice la siguiente palabra en un mensaje, un LLM predice palabras con el conocimiento de bibliotecas enteras. Para usarlo bien: 1. Dale un Rol, 2. Dale el Contexto específico, y 3. Pide el Formato deseado (puntos, tablas o pasos).',
      zh: '正如手机输入法在打字时联想下一个词一样，大语言模型（LLM）根据前文统计概率预测最合适的词句，但它掌握着全学科的知识。高效运用的 3 大黄金法则：1. 赋予身份角色（“请扮演一位专业理发师”）；2. 明确具体背景（“顾客头发漂损且需要染蜜糖金”）；3. 规定输出格式（“请用通俗要点列出 3 个步骤”）。',
      hi: 'जैसे आपका फ़ोन टाइप करते समय अगले शब्द का सुझाव देता है, वैसे ही LLM आपकी बात को पूरा करने के लिए अगले उपयोगी शब्दों की भविष्यवाणी करता है। इसे उपयोग करने के 3 सुनहरे नियम: 1. भूमिका बताएं ("एक अनुभवी तकनीशियन बनें"), 2. संदर्भ दें ("मेरी परिस्थिति यह है"), 3. प्रारूप बताएं ("3 आसान बिंदुओं में बताएं")।',
      fr: 'Tout comme le clavier de votre téléphone suggère le mot suivant, un LLM prédit les mots les plus pertinents pour compléter votre pensée. 3 règles d’or : 1. Donnez-lui un Rôle, 2. Donnez le Contexte exact, 3. Précisez le Format souhaité.',
      de: 'Wie die Worterkennung auf dem Smartphone sagt ein LLM die nächsten passenden Wörter voraus – fundiert auf Bibliotheken voll Wissen. Die 3 goldenen Regeln: 1. Rolle vorgeben, 2. Kontext liefern, 3. Format festlegen (z.B. 3-Punkte-Checkliste).'
    },
    takeaway: {
      en: 'The 3 Golden Rules of AI: Role + Context + Output Format guarantee high-quality results.',
      es: 'Las 3 Reglas de Oro: Rol + Contexto + Formato garantizan resultados profesionales siempre.',
      zh: '掌握“角色定位 + 真实背景 + 输出格式”3 大黄金法则，即可每次都获得极高水准的回复。',
      hi: 'एआई के 3 सुनहरे नियम: भूमिका + संदर्भ + प्रारूप हमेशा सर्वोत्तम परिणाम सुनिश्चित करते हैं।',
      fr: 'Les 3 règles d’or : Rôle + Contexte + Format garantissent des réponses de haute qualité.',
      de: 'Die 3 goldenen Regeln: Rolle + Kontext + Ausgabeformat garantieren zuverlässige Antworten.'
    },
    tags: ['Prompting', 'LLM', 'Productivity', 'Everyday Skills']
  },
  {
    id: 'what-is-token',
    category: 'what',
    pillLabel: {
      en: 'What is a Token?',
      es: '¿Qué es un Token?',
      zh: '什么是 Token？',
      hi: 'टोकन (Token) क्या है?',
      fr: 'Qu’est-ce qu’un Token ?',
      de: 'Was ist ein Token?'
    },
    title: {
      en: 'What is a Token? The Fundamental Atomic Currency of Language Models',
      es: 'Qué es un Token: la unidad atómica fundamental de los modelos de lenguaje',
      zh: '什么是 Token？大语言模型认知与计费的基础原子单位',
      hi: 'टोकन क्या है? लार्ज लैंग्वेज मॉडल की मौलिक परमाणु इकाई',
      fr: 'Qu’est-ce qu’un Token ? L’unité atomique fondamentale des modèles de langage',
      de: 'Was ist ein Token? Die elementare atomare Einheit von Sprachmodellen'
    },
    explanation: {
      en: 'Large language models do not read text letter-by-letter or word-by-word. Text is decomposed by a Tokenizer into sub-word fragments called tokens. In English, 1 token is roughly 4 characters or 0.75 words. For example, "unbelievable" splits into ["un", "believ", "able"]. The vocabulary size of modern models is typically 32,000 to 128,000 distinct tokens.',
      es: 'Los modelos no leen palabras completas. Un tokenizador divide el texto en fragmentos sub-palabra llamados tokens. En promedio, 1 token equivale a 4 caracteres en inglés o 0.75 palabras.',
      zh: '大语言模型既不按单个字母阅读，也不直接处理整词。分词器（Tokenizer）将文本切分成称为 Token 的子词片段。在英文中，1 个 Token 大致对应 4 个字符或 0.75 个单词；在中文中，每个常用汉字通常占用 1 到 2 个 Token。现代模型的词表库通常包含 3.2 万至 12.8 万个不同的固定 Token。',
      hi: 'LLM अक्षरों या पूरे शब्दों को सीधे नहीं पढ़ते। टेक्स्ट को टोकेनाइज़र द्वारा छोटे टुकड़ों में विभाजित किया जाता है जिन्हें टोकन कहते हैं। औसतन 1 टोकन लगभग 4 वर्ण या 0.75 शब्द के बराबर होता है।',
      fr: 'Les modèles ne lisent pas mot par mot. Un tokenizer découpe le texte en fragments appelés tokens. Un token équivaut environ à 4 caractères ou 0.75 mot en anglais.',
      de: 'Sprachmodelle verarbeiten Text nicht wortweise, sondern in Teilwörtern – sogenannten Tokens. Ein Token entspricht im Englischen etwa 4 Zeichen oder 0,75 Wörtern.'
    },
    takeaway: {
      en: 'Tokens are the atomic units that models predict, count for context limits, and bill for compute.',
      es: 'Los tokens son las unidades que el modelo predice, mide para límites de contexto y factura.',
      zh: 'Token 是模型在概率场中预测的基本颗粒，是上下文窗口的度量尺度，也是云端 API 计费的唯一基准。',
      hi: 'टोकन वे मौलिक इकाइयाँ हैं जिनकी मॉडल भविष्यवाणी करता है और जो मेमोरी व लागत तय करती हैं।',
      fr: 'Les tokens sont les unités fondamentales que les modèles prédisent, comptent et facturent.',
      de: 'Tokens sind die Basiseinheiten, die Modelle vorhersagen, für Kontextlimits zählen und abrechnen.'
    },
    tags: ['Tokenizer', 'Inference', 'Core Concepts']
  },
  {
    id: 'what-is-context-window',
    category: 'what',
    pillLabel: {
      en: 'What is a Context Window?',
      es: '¿Qué es la Ventana de Contexto?',
      zh: '什么是上下文窗口？',
      hi: 'कॉन्टेक्स्ट विंडो क्या है?',
      fr: 'Qu’est-ce qu’une Fenêtre de Contexte ?',
      de: 'Was ist ein Kontextfenster?'
    },
    title: {
      en: 'What is a Context Window? The Active Working Memory of an LLM',
      es: 'Qué es una ventana de contexto: la memoria de trabajo activa de un LLM',
      zh: '什么是上下文窗口？大语言模型的即时工作记忆容量上限',
      hi: 'कॉन्टेक्स्ट विंडो क्या है? LLM की सक्रिय कार्यशील स्मृति (वर्किंग मेमोरी)',
      fr: 'Qu’est-ce qu’une fenêtre de contexte ? La mémoire de travail active d’un LLM',
      de: 'Was ist ein Kontextfenster? Das aktive Arbeitsgedächtnis eines LLMs'
    },
    explanation: {
      en: 'The context window defines the total number of tokens an LLM can hold in attention memory during a single prompt-response turn (e.g. 8k, 32k, 128k, or 1M tokens). When a conversation or document exceeds this limit, older tokens must be truncated or summarized, or the model loses recall. Managing this window through intelligent chunking and RAG is the primary craft of AI Engineering.',
      es: 'Es el número máximo de tokens que un modelo puede retener en memoria activa durante una interacción. Todo lo que quede fuera de este límite se pierde o se olvida.',
      zh: '上下文窗口规定了大模型在单词推理交互中能够同时保留在注意力机制内的 Token 总数上限（例如 8K、32K、128K 或 100 万 Token）。一旦对话历史或文档超出该上限，超出的部分将被无情截断丢失。通过高效切分（Chunking）与 RAG 精准调度这扇窗口，正是 AI 工程师的核心专业技能。',
      hi: 'कॉन्टेक्स्ट विंडो उन टोकनों की अधिकतम संख्या है जिन्हें एक मॉडल एक समय में अपनी ध्यान स्मृति में रख सकता है। इस सीमा से अधिक होने पर पुराना डेटा विस्मृत हो जाता है।',
      fr: 'La fenêtre de contexte représente le nombre maximal de tokens qu’un LLM peut maintenir en mémoire d’attention active lors d’un échange.',
      de: 'Das Kontextfenster definiert die maximale Anzahl an Tokens, die ein Modell im Aufmerksamkeitsbereich eines Aufrufs aktiv behalten kann.'
    },
    takeaway: {
      en: 'Your prompt, system instructions, RAG chunks, and model response all share one fixed token budget.',
      es: 'Tu prompt, instrucciones, fragmentos RAG y la respuesta comparten un mismo presupuesto.',
      zh: '您的系统提示词、检索到的 RAG 文档碎片以及模型的输出回复，共同瓜分同一个严格受限的 Token 预算。',
      hi: 'आपका प्रॉम्प्ट, सिस्टम निर्देश, RAG चंक्स और मॉडल का उत्तर सभी एक ही सीमित टोकन बजट साझा करते हैं।',
      fr: 'Votre prompt, instructions, extraits RAG et la réponse se partagent le même budget.',
      de: 'Prompt, Systemanweisung, RAG-Abschnitte und Antwort teilen sich dasselbe feste Token-Budget.'
    },
    tags: ['Context', 'Attention', 'Memory Management']
  },
  {
    id: 'what-is-temperature',
    category: 'what',
    pillLabel: {
      en: 'What is Temperature?',
      es: '¿Qué es la Temperatura?',
      zh: '什么是 Temperature（温度参数）？',
      hi: 'तापमान (Temperature) क्या है?',
      fr: 'Qu’est-ce que la Température ?',
      de: 'Was ist die Temperatur?'
    },
    title: {
      en: 'What is Temperature? The Probability Distribution and Creativity Dial',
      es: 'Qué es la temperatura: el dial de distribución de probabilidad y creatividad',
      zh: '什么是 Temperature？控制模型输出概率分布与确定性/创造性的旋钮',
      hi: 'तापमान (Temperature) क्या है? संभावना वितरण और रचनात्मकता का नियंत्रक',
      fr: 'Qu’est-ce que la température ? Le curseur de probabilité et de créativité',
      de: 'Was ist die Temperatur? Der Regler für Wahrscheinlichkeitsverteilung und Kreativität'
    },
    explanation: {
      en: 'Before outputting a token, the model computes raw logits (scores) for every token in its vocabulary. The Temperature hyperparameter scales these logits before passing them to the Softmax function. At Temperature = 0.0, the model strictly chooses the highest-probability token (greedy, deterministic code execution). At Temperature = 0.8, the probability curve flattens, introducing stylistic variation and diverse wording.',
      es: 'La temperatura regula cómo el modelo elige la siguiente palabra. A 0.0 es totalmente predecible y determinista (ideal para código). A 0.8 o más se vuelve más diverso y creativo.',
      zh: '在预测下一个 Token 时，模型会为词表中的每个词计算未归一化的原始分值（Logits）。Temperature 参数在应用 Softmax 函数之前对这些分值进行缩放。温度设为 0.0 时，模型严格选择概率最高的那一个词（贪婪采样，高度确定，极适合编程与数学）；温度设为 0.8 时，概率分布被平滑，使词汇选择更加丰富多变（适合创意写作）。',
      hi: 'तापमान नियंत्रित करता है कि मॉडल अगले शब्द को कितनी सख्ती से चुनता है। 0.0 पर यह पूरी तरह से सटीक और निश्चित होता है (कोडिंग के लिए सर्वोत्तम); 0.8 पर यह अधिक रचनात्मक और विविध शब्द चुनता है।',
      fr: 'La température ajuste la façon dont le modèle sélectionne le mot suivant. À 0.0, il est strictement déterministe (code). À 0.8, il offre une plus grande richesse stylistique.',
      de: 'Die Temperatur steuert die Auswahl des nächsten Tokens. Bei 0.0 arbeitet das Modell deterministisch (ideal für Code), bei 0.8 formuliert es freier und variantenreicher.'
    },
    takeaway: {
      en: 'Set Temperature to 0.0 for deterministic code and JSON schemas; raise to 0.7+ for creative brainstorming.',
      es: 'Usa 0.0 para código y JSON estructurado; sube a 0.7+ para lluvia de ideas creativas.',
      zh: '在编写 Python 代码或生成严格 JSON 数据时将温度锁定为 0.0；在头脑风暴或文学创作时调高至 0.7 以上。',
      hi: 'सटीक कोड और JSON के लिए तापमान 0.0 रखें; रचनात्मक विचारों के लिए 0.7+ तक बढ़ाएं।',
      fr: 'Réglez la température à 0.0 pour le code et le JSON ; augmentez à 0.7+ pour l’idéation créative.',
      de: 'Nutzen Sie 0.0 für Code und JSON-Strukturen; erhöhen Sie auf 0.7+ für kreatives Brainstorming.'
    },
    tags: ['Softmax', 'Inference', 'Hyperparameters']
  },
  {
    id: 'how-attention-works',
    category: 'how',
    pillLabel: {
      en: 'How Attention Works (Q, K, V)',
      es: '¿Cómo Funciona la Atención (Q, K, V)?',
      zh: 'Attention（注意力机制 Q, K, V）如何运行？',
      hi: 'अटेंशन (Q, K, V) कैसे काम करता है?',
      fr: 'Comment Fonctionne l’Attention (Q, K, V) ?',
      de: 'Wie funktioniert Attention (Q, K, V)?'
    },
    title: {
      en: 'How Attention Actually Works: The Mathematics of Q, K, and V',
      es: 'Cómo funciona la atención: las matemáticas detrás de Query, Key y Value',
      zh: '注意力机制核心数学原理：Query（查询）、Key（键）与 Value（值）',
      hi: 'अटेंशन का वास्तविक गणित: Query, Key और Value की कार्यप्रणाली',
      fr: 'Le fonctionnement mathématique de l’attention : Query, Key et Value',
      de: 'Mathematik des Attention-Mechanismus: Query, Key und Value'
    },
    explanation: {
      en: 'Attention is mathematically modeled as a content-addressable memory lookup: Attention(Q, K, V) = Softmax( (Q · K^T) / sqrt(d_k) ) · V. The Query vector represents what a token is asking for, Key vectors represent what other tokens contain, and Value vectors represent their information payload. The dot product measures alignment, scaled by 1/sqrt(d_k) to prevent vanishing gradients.',
      es: 'La atención funciona como una memoria asociativa: Query busca, Key compara relevancia mediante producto punto, y Value aporta la información, escalado por 1/sqrt(d_k) para mantener estabilidad numérica.',
      zh: '注意力机制在本质上是一个可寻址的关联内容查找器：Query（查询向量）提出需求，Key（键向量）声明自身内容，两者的点积计算出相关性权重，再经 1/sqrt(d_k) 缩放避免梯度消失，最后对 Value（值向量）进行加权求和。',
      hi: 'अटेंशन एक कंटेंट-एड्रेसेबल मेमोरी की तरह है: Query मांग करता है, Key तुलना करता है, और Value वास्तविक जानकारी देता है। 1/sqrt(d_k) द्वारा स्केलिंग ग्रेडिएंट को स्थिर रखती है।',
      fr: 'L’attention est une recherche en mémoire adressable : Query interroge, Key évalue la pertinence par produit scalaire, et Value fournit l’information pondérée par Softmax.',
      de: 'Attention ist ein inhaltsadressierbarer Speicherabruf: Query fragt an, Key vergleicht Relevanz per Skalarprodukt, und Value liefert die gewichtete Repräsentation.'
    },
    takeaway: {
      en: 'Attention is dynamic memory routing: Query asks, Key matches, Value provides.',
      es: 'La atención es enrutamiento dinámico: Query pregunta, Key coincide, Value provee.',
      zh: '注意力机制是动态记忆路由：Query 提出需求，Key 精确匹配，Value 提供内容。',
      hi: 'अटेंशन गतिशील मेमोरी रूटिंग है: Query पूछता है, Key मेल खाता है, Value सामग्री देता है।',
      fr: 'L’attention est un routage dynamique : Query demande, Key associe, Value fournit.',
      de: 'Attention ist dynamisches Speicher-Routing: Query fragt, Key verknüpft, Value liefert.'
    },
    tags: ['Transformers', 'Attention', 'Linear Algebra']
  },
  {
    id: 'how-kv-cache-works',
    category: 'how',
    pillLabel: {
      en: 'Why KV-Cache is Essential',
      es: '¿Por qué el KV-Cache es Esencial?',
      zh: '为什么 KV-Cache（键值缓存）不可或缺？',
      hi: 'KV-Cache क्यों आवश्यक है?',
      fr: 'Pourquoi le KV-Cache est Indispensable ?',
      de: 'Warum der KV-Cache unverzichtbar ist'
    },
    title: {
      en: 'Why LLM Memory Explodes: The Invariant Mechanics of the KV-Cache',
      es: 'Por qué explota la memoria en LLMs: la mecánica del KV-Cache',
      zh: '为什么大模型推理显存会暴涨？KV-Cache 核心机制与内存计算',
      hi: 'एलएलएम मेमोरी क्यों तेजी से बढ़ती है: KV-Cache का सिद्धांत',
      fr: 'Pourquoi la mémoire s’emballe en inférence : le rôle clé du KV-Cache',
      de: 'Warum der Speicherbedarf explodiert: Die Mechanik des KV-Cache'
    },
    explanation: {
      en: 'During autoregressive token generation, past tokens do not change. Computing each new token would take O(N^2) if we recalculated past Keys and Values. The KV-Cache preserves past Keys and Values in VRAM. However, memory scales linearly with sequence length: Memory = 2 * layers * heads * d_head * tokens * bytes. At 128k context, KV-cache can exceed 40GB+ of VRAM.',
      es: 'Al generar texto, recomputar cada token costaría O(N^2). El KV-Cache guarda los Keys y Values en VRAM para generar a O(1) por paso. En contextos de 128k tokens, puede consumir más de 40GB de memoria de video.',
      zh: '自回归生成每一个新 Token 时，过去的 Token 已经固定。重新计算会导致 O(N^2) 的计算浪费。KV-Cache 将前面所有 Token 的 Key 和 Value 缓存在显存中，使每次新生成只需 O(1) 的增量运算。但其内存占用与上下文长度严格线性增长：128k 上下文可轻松耗尽 40GB+ 显存。',
      hi: 'हर नए टोकन पर पुराने टोकन दोबारा प्रोसेस करना O(N^2) कम्प्यूट खर्च करता है। KV-Cache इन वैल्यूज को VRAM में सहेजता है। 128k कॉन्टेक्स्ट में यह 40GB+ VRAM ले सकता है।',
      fr: 'Pour éviter de recalculer chaque token en O(N^2), le KV-Cache conserve les Keys et Values en VRAM. Cependant, à 128k tokens, il peut dépasser 40 Go de mémoire vidéo.',
      de: 'Um O(N^2)-Berechnungen zu vermeiden, speichert der KV-Cache Keys und Values im VRAM. Bei 128k Tokens kann dies jedoch leicht über 40 GB Videospeicher belegen.'
    },
    takeaway: {
      en: 'Inference is memory-bandwidth bound: KV-cache trades VRAM capacity for 10x token generation speed.',
      es: 'La inferencia está limitada por el ancho de banda: el KV-Cache cambia VRAM por velocidad.',
      zh: '大模型推理的瓶颈在于显存带宽：KV-Cache 用显存容量换取了 10 倍以上的极速生成。',
      hi: 'अनुमान मेमोरी-बैंडविड्थ से बंधा है: KV-Cache VRAM के बदले 10x टोकन गति प्रदान करता है।',
      fr: 'L’inférence dépend de la bande passante : le KV-Cache échange la VRAM contre une vitesse décuplée.',
      de: 'Inferenz ist speicherbandbreitenlimitiert: Der KV-Cache tauscht VRAM gegen 10-fache Geschwindigkeit.'
    },
    tags: ['Inference', 'KV-Cache', 'Hardware Scaling']
  },
  {
    id: 'what-is-test-time-compute',
    category: 'what',
    pillLabel: {
      en: 'What is Test-Time Compute?',
      es: '¿Qué es Test-Time Compute?',
      zh: '什么是 Test-Time Compute（测试期计算）？',
      hi: 'टेस्ट-टाइम कंप्यूट (Test-Time Compute) क्या है?',
      fr: 'Qu’est-ce que le Test-Time Compute ?',
      de: 'Was ist Test-Time Compute?'
    },
    title: {
      en: 'Reasoning Tokens & Test-Time Compute: The Shift from Memorization to Search',
      es: 'Tokens de razonamiento y Test-Time Compute: el paso de memorizar a razonar',
      zh: '推理 Token 与测试期计算：从“静态记忆预测”到“动态搜索思考”的范式革命',
      hi: 'रीजनिंग टोकन और टेस्ट-टाइम कंप्यूट: याद रखने से सोचने की ओर बदलाव',
      fr: 'Tokens de raisonnement et calcul au test : de la mémorisation à la réflexion',
      de: 'Reasoning-Tokens und Test-Time Compute: Vom Auswendiglernen zum logischen Suchen'
    },
    explanation: {
      en: 'Classic LLMs only spend compute during pre-training; at inference, they output the first token that comes to mind. Reasoning models (o1, o3, Claude 3.7 Thinking) scale compute at test-time. They generate internal hidden thinking chains, explore candidate hypothesis trees, verify mathematical steps, and backtrack when an error is caught before showing the user the answer.',
      es: 'Los modelos clásicos responden de inmediato con un solo paso. Los modelos de razonamiento (como o1 o Claude Thinking) dedican tiempo a "pensar" durante la inferencia, explorando ramas lógicas y corrigiendo errores antes de responder.',
      zh: '经典大模型只在预训练阶段消耗主要算力，推理时直接吐出概率最高的下一个词。而现代推理模型（如 o1、o3、Claude 3.7 Thinking）在推理时（Test-Time）自主扩展计算：生成内部思维链、展开树状搜索、检验中间结论并自主回溯纠错。',
      hi: 'पारंपरिक मॉडल तुरंत उत्तर देते हैं। रीजनिंग मॉडल (जैसे o1) उत्तर देने से पहले आंतरिक रूप से सोचते हैं, त्रुटियां जांचते हैं और तार्किक रास्ते खोजते हैं।',
      fr: 'Les modèles classiques génèrent immédiatement. Les modèles de raisonnement allouent du calcul au moment du test pour explorer des hypothèses, vérifier et corriger.',
      de: 'Klassische Modelle antworten sofort. Reasoning-Modelle investieren Rechenleistung zur Inferenzzeit, um Denkbäume zu prüfen und Fehler vorab zu korrigieren.'
    },
    takeaway: {
      en: 'Spending more compute at inference time yields higher accuracy on complex reasoning tasks.',
      es: 'Invertir más cómputo en la inferencia multiplica la precisión en razonamiento complejo.',
      zh: '在推理时刻消耗更多思考算力，能在大逻辑推理、编程与数学证明上实现准确率质的跃迁。',
      hi: 'अनुमान के समय अधिक सोचने से जटिल गणित और कोडिंग में सटीकता कई गुना बढ़ जाती है।',
      fr: 'Consacrer plus de calcul à l’inférence maximise la précision sur les tâches complexes.',
      de: 'Mehr Rechenzeit bei der Inferenz führt zu drastisch höherer Präzision bei komplexer Logik.'
    },
    tags: ['Reasoning', 'Search Trees', 'Modern Paradigms']
  },
  {
    id: 'what-is-mcp',
    category: 'what',
    pillLabel: {
      en: 'What is MCP Protocol?',
      es: '¿Qué es el Protocolo MCP?',
      zh: '什么是 Model Context Protocol (MCP)？',
      hi: 'Model Context Protocol (MCP) क्या है?',
      fr: 'Qu’est-ce que le Protocole MCP ?',
      de: 'Was ist das Model Context Protocol (MCP)?'
    },
    title: {
      en: 'Model Context Protocol (MCP): The Universal USB-C Standard for AI Agents',
      es: 'Model Context Protocol (MCP): el puerto universal USB-C para agentes de IA',
      zh: 'Model Context Protocol (MCP)：AI 智能体的通用“USB-C”连接器标准',
      hi: 'Model Context Protocol (MCP): एआई एजेंट्स के लिए यूनिवर्सल मानक',
      fr: 'Model Context Protocol (MCP) : le port USB-C universel pour agents IA',
      de: 'Model Context Protocol (MCP): Der universelle USB-C-Standard für KI-Agenten'
    },
    explanation: {
      en: 'Previously, connecting an AI model to tools (databases, GitHub, terminal) required custom, fragmented SDKs. Anthropic introduced Model Context Protocol (MCP) as an open standard over JSON-RPC 2.0. A standardized MCP client queries an MCP server with tools/list, requests tools/call, and streams structured results. Any agent can securely interface with any tool ecosystem worldwide.',
      es: 'MCP estandariza cómo los agentes se conectan a herramientas mediante JSON-RPC 2.0. En lugar de escribir código a medida para cada base de datos o API, MCP actúa como un conector universal abierto.',
      zh: '过去连接大模型与外部工具（数据库、Git、命令行）往往依赖各自碎片化的私有 SDK。Anthropic 推出的 Model Context Protocol (MCP) 成为开放的 JSON-RPC 2.0 国际通用标准。通过 tools/list 声明能力、tools/call 安全调用，任何智能体都能无缝插拔各类外部工具。',
      hi: 'MCP एआई टूल्स को जोड़ने का खुला मानक है जो JSON-RPC 2.0 का उपयोग करता है। यह विभिन्न डेटाबेस और टूल के लिए अलग कोड लिखने की आवश्यकता को समाप्त करता है।',
      fr: 'MCP normalise la communication entre les modèles et les outils via JSON-RPC 2.0, remplaçant les intégrations propriétaires par un standard universel ouvert.',
      de: 'MCP vereinheitlicht die Werkzeuganbindung über JSON-RPC 2.0 und ersetzt fragmentierte Einzellösungen durch einen offenen Standard für alle KI-Agenten.'
    },
    takeaway: {
      en: 'MCP is the open JSON-RPC 2.0 protocol decoupling AI reasoning from tool implementation.',
      es: 'MCP es el estándar abierto que separa el razonamiento de la implementación de herramientas.',
      zh: 'MCP 是开放解耦标准：模型专注于高维推理，工具服务器专注于底层安全执行。',
      hi: 'MCP खुला मानक है जो एआई सोच को टूल के कार्यान्वयन से अलग और सुरक्षित करता है।',
      fr: 'MCP est le standard ouvert qui sépare le raisonnement de l’exécution des outils.',
      de: 'MCP ist das offene Protokoll, das logisches Schließen von der Tool-Implementierung entkoppelt.'
    },
    tags: ['MCP', 'Tool Calling', 'Agent Architecture']
  }
];

