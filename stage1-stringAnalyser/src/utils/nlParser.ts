function parseNaturalLanguageQuery(q: string): {
  where: Record<string, any>;
  customChecks: Array<(row: any) => boolean>;
  parsedFilters: Record<string, any>;
} {
  const text = (q || "").toLowerCase();
  const where: Record<string, any> = {};
  const customChecks: Array<(row: any) => boolean> = [];
  const parsedFilters: Record<string, any> = {};

  // --- palindromic / palindrome ---
  if (text.includes("palindromic") || text.includes("palindrome")) {
    where.is_palindrome = true;
    parsedFilters.is_palindrome = true;
  }

  // --- single word or single-word ---
  if (/\bsingle[- ]word\b/.test(text)) {
    where.word_count = 1;
    parsedFilters.word_count = 1;
  }

  // --- strings longer than X characters ---
  const longerMatch = text.match(/longer than (\d+)\b/);
  if (longerMatch) {
    const min = Number(longerMatch[1]);
    where.length = { gt: min };
    parsedFilters.min_length = min + 1;

    // optional runtime check (useful for in-memory fallback)
    customChecks.push((row) => row.length > min);
  }

  // --- strings containing the letter <x> ---
  const containsLetter = text.match(/letter\s+([a-zA-Z])/i);
  if (containsLetter && containsLetter[1]) {
    const char = containsLetter[1].toLowerCase();
    where.value = { contains: char, mode: "insensitive" };
    parsedFilters.contains_character = char;

    customChecks.push(
      (row) =>
        typeof row.value === "string" &&
        row.value.toLowerCase().includes(char)
    );
  }

  // --- "first vowel" -> interpret as "contains any vowel" ---
  if (text.includes("first vowel")) {
    parsedFilters.contains_vowel = true;
    customChecks.push(
      (row) => typeof row.value === "string" && /[aeiou]/i.test(row.value)
    );
  }

  return { where, customChecks, parsedFilters };
}

module.exports = {  parseNaturalLanguageQuery };