import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const value = 'madam anna level';
  const sha256_hash = crypto.createHash('sha256').update(value).digest('hex');

  const frequencyMap = value.split('').reduce((acc: Record<string, number>, char) => {
    if (char !== ' ') {
      acc[char] = (acc[char] || 0) + 1;
    }
    return acc;
  }, {});

  const result = await prisma.stringAnalysis.create({
    data: {
        id:sha256_hash,
      value,
      length: value.length,
      is_palindrome: value === value.split('').reverse().join(''),
      unique_characters: new Set(value.replace(/\s+/g, '')).size,
      word_count: value.trim().split(/\s+/).length,
      sha256_hash,
      character_frequency_map: frequencyMap,
    },
  });

  console.log('✅ Seed successful!');
  console.table(result);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
