const cryptos = require('crypto');

function generateSHA256Hash(input: string): string {
  return cryptos.createHash('sha256').update(input).digest('hex');
}

function getCharacterFrequencyMap(input: string): Record<string, number> {
  const frequencyMap: Record<string, number> = {};

  for (const char of input) {
    frequencyMap[char] = (frequencyMap[char] || 0) + 1;
  }

  return frequencyMap;
}

// console.log(generateSHA256Hash('example')); // Example usage
// console.log(getCharacterFrequencyMap('example')); // Example usage

module.exports = {
  generateSHA256Hash,
  getCharacterFrequencyMap,
};
