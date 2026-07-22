import * as deepl from 'deepl-node';

const authKey = process.env.DEEPL_API_KEY;
let translator: deepl.Translator | null = null;

if (authKey) {
  translator = new deepl.Translator(authKey);
}

/**
 * Traduit un texte du français vers l'anglais via DeepL.
 * Retourne le texte original si l'API échoue ou si la clé n'est pas configurée.
 */
export async function translateText(text: string | null | undefined): Promise<string> {
  if (!text || text.trim() === '') return '';
  if (!translator) {
    console.warn("DEEPL_API_KEY non configurée. Traduction ignorée.");
    return text;
  }

  try {
    const result = await translator.translateText(text, 'fr', 'en-US');
    return result.text;
  } catch (error) {
    console.error("Erreur lors de la traduction DeepL:", error);
    // En cas d'erreur (quota, réseau, etc.), on retourne le texte original
    return text;
  }
}

/**
 * Traduit plusieurs textes en un seul appel API pour économiser des requêtes.
 * Retourne un tableau avec les traductions correspondantes.
 */
export async function translateTexts(texts: (string | null | undefined)[]): Promise<string[]> {
  const validTexts = texts.map(t => (t && t.trim() !== '') ? t : '');
  if (!translator) {
    console.warn("DEEPL_API_KEY non configurée. Traduction ignorée.");
    return validTexts;
  }

  // Filtrer les textes vides pour ne pas les envoyer à DeepL inutilement
  const textsToTranslate = validTexts.filter(t => t !== '');
  if (textsToTranslate.length === 0) return validTexts;

  try {
    const results = await translator.translateText(textsToTranslate, 'fr', 'en-US');
    
    // Si on a envoyé un tableau, la réponse est un tableau
    const resultsArray = Array.isArray(results) ? results : [results];
    
    // Reconstruire le tableau en remettant les textes vides à leur place
    let resultIndex = 0;
    return validTexts.map(t => {
      if (t === '') return '';
      return resultsArray[resultIndex++].text;
    });
  } catch (error) {
    console.error("Erreur lors de la traduction multiple DeepL:", error);
    return validTexts;
  }
}
