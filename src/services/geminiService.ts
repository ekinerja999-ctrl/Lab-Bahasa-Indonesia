import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const JSON_CLEANER = (text: string) => {
  // Remove potential markdown code blocks
  return text.replace(/```json\n?|```/g, "").trim();
};

export interface GeneratedSentence {
  pattern: string;
  elements: string[];
  words: string[];
}

export interface GeneratedQuestion {
  word: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface ConjunctionQuestion {
  sentence: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface PhraseQuestion {
  sentence: string;
  phrase: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface ClauseQuestion {
  sentence: string;
  clauses: {
    text: string;
    type: "Induk" | "Anak";
  }[];
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface LiteraryWork {
  title: string;
  summary: string;
}

export interface GeneratedAuthor {
  name: string;
  period: string;
  bio: string;
  works: LiteraryWork[];
  quote: string;
}

export const generateSentence = async (patternName: string): Promise<GeneratedSentence> => {
  const prompt = `Hasilkan contoh kalimat Tunggal dalam Bahasa Indonesia dengan pola sintaksis: ${patternName}. 
  Kalimat harus bervariasi, menarik, dan menantang.
  Berikan hasil dalam format JSON dengan properti: 
  - pattern: nama pola (string)
  - elements: daftar tipe elemen (S, P, O, Pel, K) (array of string)
  - words: daftar kata/frasa yang membentuk kalimat tersebut secara berurutan sesuai elemennya (array of string).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 2048,
        temperature: 0.9,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pattern: { type: Type.STRING },
            elements: { type: Type.ARRAY, items: { type: Type.STRING } },
            words: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["pattern", "elements", "words"]
        },
      },
    });

    const cleanedText = JSON_CLEANER(response.text || "");
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Error (generateSentence):", error);
    throw error;
  }
};

export const generateVocabularyQuestion = async (theme: string = "umum"): Promise<GeneratedQuestion> => {
  const prompt = `Hasilkan satu pertanyaan pilihan ganda (4 opsi) mengenai kosakata Bahasa Indonesia tingkat lanjut yang berkaitan dengan tema: ${theme}. 
  Fokus pada sinonim, antonim, atau makna kata yang kompleks.
  Berikan hasil dalam format JSON dengan properti:
  - word: kata yang ditanyakan (string)
  - options: daftar 4 pilihan jawaban (array of string)
  - correct: indeks jawaban yang benar (0-3) (number)
  - explanation: penjelasan mendalam mengapa itu benar (string)`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 2048,
        temperature: 0.9,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correct: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
          },
          required: ["word", "options", "correct", "explanation"]
        },
      },
    });

    const cleanedText = JSON_CLEANER(response.text || "");
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Error (generateVocabularyQuestion):", error);
    throw error;
  }
};

export const generateConjunctionQuestion = async (): Promise<ConjunctionQuestion> => {
  const prompt = `Hasilkan satu pertanyaan tentang penggunaan kata hubung (konjungsi) dalam kalimat Bahasa Indonesia.
  Kalimat harus rumpang ("___") dan siswa harus memilih konjungsi yang paling tepat secara gramatikal dan semantik.
  Kembalikan dalam format JSON:
  - sentence: kalimat dengan bagian rumpang (string)
  - options: 4 pilihan konjungsi (array of string)
  - correct: indeks jawaban benar (0-3) (number)
  - explanation: penjelasan tentang fungsi konjungsi tersebut (string)`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 2048,
        temperature: 0.9,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentence: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correct: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
          },
          required: ["sentence", "options", "correct", "explanation"]
        },
      },
    });

    const cleanedText = JSON_CLEANER(response.text || "");
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Error (generateConjunctionQuestion):", error);
    throw error;
  }
};

export const generatePhraseQuestion = async (): Promise<PhraseQuestion> => {
  const prompt = `Hasilkan satu pertanyaan tentang analisis frasa dalam kalimat Bahasa Indonesia.
  Identifikasi sebuah frasa dalam kalimat dan tanyakan jenisnya (Nomina, Verba, Adjektiva, Preposisional, Adverbial).
  Kembalikan dalam format JSON:
  - sentence: kalimat lengkap (string)
  - phrase: frasa yang ditanyakan (string)
  - options: 4 pilihan jenis frasa (array of string)
  - correct: indeks jawaban benar (0-3) (number)
  - explanation: penjelasan struktur frasa tersebut (string)`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 2048,
        temperature: 0.9,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentence: { type: Type.STRING },
            phrase: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correct: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
          },
          required: ["sentence", "phrase", "options", "correct", "explanation"]
        },
      },
    });

    const cleanedText = JSON_CLEANER(response.text || "");
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Error (generatePhraseQuestion):", error);
    throw error;
  }
};

export const generateClauseQuestion = async (): Promise<ClauseQuestion> => {
  const prompt = `Hasilkan satu pertanyaan tentang analisis klausa (Induk vs Anak) dalam kalimat majemuk Bahasa Indonesia.
  Kembalikan dalam format JSON:
  - sentence: kalimat majemuk lengkap (string)
  - clauses: daftar objek { text, type: "Induk" | "Anak" } yang membagi kalimat tersebut (array)
  - question: pertanyaan tentang peran atau jenis salah satu klausa (string)
  - options: 4 pilihan jawaban (array of string)
  - correct: indeks jawaban benar (0-3) (number)
  - explanation: penjelasan hubungan antar klausa (string)`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 2048,
        temperature: 0.9,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentence: { type: Type.STRING },
            clauses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["Induk", "Anak"] }
                },
                required: ["text", "type"]
              }
            },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correct: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
          },
          required: ["sentence", "clauses", "question", "options", "correct", "explanation"]
        },
      },
    });

    const cleanedText = JSON_CLEANER(response.text || "");
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Error (generateClauseQuestion):", error);
    throw error;
  }
};

export const generateAuthorInfo = async (authorName: string): Promise<GeneratedAuthor> => {
  const prompt = `Berikan informasi lengkap mengenai tokoh sastra Indonesia bernama: ${authorName}. 
  Berikan hasil dalam format JSON dengan properti:
  - name: nama lengkap (string)
  - period: angkatan sastra/periode (string)
  - bio: biografi singkat (string)
  - works: daftar 3 karya terkenal, masing-masing dengan title (string) dan summary (string/ringkasan sangat singkat 1-2 kalimat)
  - quote: satu kutipan terkenal dari tokoh tersebut (string)`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 2048,
        temperature: 0.8,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            period: { type: Type.STRING },
            bio: { type: Type.STRING },
            works: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING }
                },
                required: ["title", "summary"]
              } 
            },
            quote: { type: Type.STRING },
          },
          required: ["name", "period", "bio", "works", "quote"]
        },
      },
    });

    const cleanedText = JSON_CLEANER(response.text || "");
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Error (generateAuthorInfo):", error);
    throw error;
  }
};
