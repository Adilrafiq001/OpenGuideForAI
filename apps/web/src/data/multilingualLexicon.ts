/**
 * OpenGuide Cross-Lingual Semantic Lexicon
 * Maps multilingual query tokens across 11 international languages to canonical English search terms.
 * Enables zero-latency, client-side cross-lingual retrieval without external translation APIs ($0 Rule).
 */

export interface MultilingualMapping {
  canonical: string;
  synonyms: string[];
}

export const MULTILINGUAL_LEXICON: Record<string, string[]> = {
  // --- Spanish (es) ---
  'atencion': ['attention'],
  'atención': ['attention'],
  'redes neuronales': ['neural network', 'deep learning'],
  'red neuronal': ['neural network', 'deep learning'],
  'aprendizaje automatico': ['machine learning'],
  'aprendizaje automático': ['machine learning'],
  'aprendizaje por refuerzo': ['reinforcement learning', 'rl', 'ppo', 'dpo'],
  'cuantizacion': ['quantization'],
  'cuantización': ['quantization'],
  'decodificacion especulativa': ['speculative decoding'],
  'decodificación especulativa': ['speculative decoding'],
  'mezcla de expertos': ['mixture of experts', 'moe', 'gshard'],
  'ajuste fino': ['fine tuning', 'lora', 'peft'],
  'difusion': ['diffusion'],
  'difusión': ['diffusion'],
  'agentes': ['agents', 'react', 'tools'],
  'estafa': ['scam', 'fraud', 'safety'],
  'oficio': ['craft', 'trades', 'everyday'],
  'memoria': ['kv cache', 'memory'],

  // --- Hindi (hi) ---
  'अटेंशन': ['attention'],
  'न्यूरल': ['neural network'],
  'न्यूरल नेटवर्क': ['neural network'],
  'मशीन लर्निंग': ['machine learning'],
  'रीइन्फोर्समेंट': ['reinforcement learning'],
  'रीइन्फोर्समेंट लर्निंग': ['reinforcement learning'],
  'क्वांटाइजेशन': ['quantization'],
  'स्पेक्युलेटिव': ['speculative decoding'],
  'स्पेक्युलेटिव डिकोडिंग': ['speculative decoding'],
  'मिक्सचर': ['mixture of experts'],
  'फाइन ट्यूनिंग': ['fine tuning'],
  'डिफ्यूजन': ['diffusion'],
  'एजेंट': ['agent', 'react'],
  'स्कैम': ['scam', 'fraud'],
  'धोखाधड़ी': ['scam', 'fraud'],
  'शिल्प': ['craft', 'trades'],
  'व्यापार': ['craft', 'trades'],
  'वेक्टर': ['vector'],
  'टोकन': ['token'],

  // --- Chinese (zh) ---
  '注意力': ['attention'],
  '神经网络': ['neural network'],
  '机器学习': ['machine learning'],
  '强化学习': ['reinforcement learning'],
  '量化': ['quantization'],
  '投机采样': ['speculative decoding'],
  '投机解码': ['speculative decoding'],
  '混合专家': ['mixture of experts'],
  '微调': ['fine tuning'],
  '扩散模型': ['diffusion'],
  '智能体': ['agent', 'react'],
  '诈骗': ['scam', 'fraud'],
  '手艺': ['craft', 'trades'],
  '向量': ['vector'],
  '标记': ['token'],
  '显存': ['kv cache', 'memory'],

  // --- French (fr) ---
  'reseaux de neurones': ['neural network'],
  'réseaux de neurones': ['neural network'],
  'apprentissage renforce': ['reinforcement learning'],
  'apprentissage renforcé': ['reinforcement learning'],
  'quantification': ['quantization'],
  'decodage speculatif': ['speculative decoding'],
  'décodage spéculatif': ['speculative decoding'],
  'melange d experts': ['mixture of experts'],
  'mélange d experts': ['mixture of experts'],
  'ajustement fin': ['fine tuning'],
  'escroquerie': ['scam', 'fraud'],
  'metier': ['craft', 'trades'],
  'métier': ['craft', 'trades'],

  // --- German (de) ---
  'aufmerksamkeit': ['attention'],
  'neuronale netze': ['neural network'],
  'maschinelles lernen': ['machine learning'],
  'verstarkendes lernen': ['reinforcement learning'],
  'verstärkendes lernen': ['reinforcement learning'],
  'quantisierung': ['quantization'],
  'spekulative dekodierung': ['speculative decoding'],
  'expertenmischung': ['mixture of experts'],
  'feinabstimmung': ['fine tuning'],
  'betrug': ['scam', 'fraud'],
  'handwerk': ['craft', 'trades'],

  // --- Arabic (ar) ---
  'انتباه': ['attention'],
  'شبكة عصبية': ['neural network'],
  'تعلم الالة': ['machine learning'],
  'تعلم الآلة': ['machine learning'],
  'تعلم معزز': ['reinforcement learning'],
  'التعلم المعزز': ['reinforcement learning'],
  'تكميم': ['quantization'],
  'فك التشفير التخميني': ['speculative decoding'],
  'خليط الخبراء': ['mixture of experts'],
  'ضبط دقيق': ['fine tuning'],
  'احتيال': ['scam', 'fraud'],
  'حرفة': ['craft', 'trades'],

  // --- Russian (ru) ---
  'внимание': ['attention'],
  'нейронная сеть': ['neural network'],
  'машинное обучение': ['machine learning'],
  'обучение с подкреплением': ['reinforcement learning'],
  'квантование': ['quantization'],
  'спекулятивное декодирование': ['speculative decoding'],
  'смесь экспертов': ['mixture of experts'],
  'мошенничество': ['scam', 'fraud'],
  'ремесло': ['craft', 'trades'],

  // --- Japanese (ja) ---
  '自己注意': ['attention'],
  'ニューラルネットワーク': ['neural network'],
  '機械学習': ['machine learning'],
  '強化学習': ['reinforcement learning'],
  '量子化': ['quantization'],
  '投機的サンプリング': ['speculative decoding'],
  '専門家混合': ['mixture of experts'],
  'ファインチューニング': ['fine tuning'],
  '詐欺': ['scam', 'fraud'],
  '職人': ['craft', 'trades']
};

/**
 * Normalizes query string and expands any cross-lingual or dialect terms into canonical English concept tokens.
 */
export function resolveMultilingualTerms(query: string): string[] {
  const normalized = query.trim().toLowerCase();
  const addedTerms: string[] = [];

  // 1. Direct multi-word key match
  for (const [foreignTerm, canonicals] of Object.entries(MULTILINGUAL_LEXICON)) {
    if (normalized.includes(foreignTerm)) {
      addedTerms.push(...canonicals);
    }
  }

  return addedTerms;
}
