import { Request, Response } from 'express';
const prisma = require('./prisma/client');
// const generateHash = require('./utils/utils').generateHash;
const {
  generateSHA256Hash,
  getCharacterFrequencyMap,
} = require('./utils/utils');

interface createStringResponse {
  id: string;
  value: string;
  properties: {
    length: number;
    is_palindrome: boolean;
    unique_characters: number;
    word_count: number;
    sha256_hash: string;
    character_frequency_map: { [key: string]: number };
  };
  created_at: string;
}
module.exports = {
  createString: async (req: Request, res: Response): Promise<void> => {
    try {
      const { value } = req.body;
      // Logic to analyze the string and store it would go here
      if (!value) {
        res
          .status(400)
          .json({ error: "Bad Request",
            message:"Invalid request body or missing 'value' field" });
        return;
      }
      if (typeof value !== 'string') {
        res
          .status(422)
          .json({ error:"Unprocessable Entity",
                message:"Invalid data type for 'value' (must be string)" });
        return;
      }
    const hashedValue = generateSHA256Hash(value);
      const textExist = await prisma.stringAnalysis.findUnique({
      where: { id: hashedValue },
    });
      console.log(textExist)
      if(textExist){
        res
          .status(409)
          .json({ error:"conflict",
                message:"String already exists in the system" });
        return;
      }
    
      // Compute string properties
    const properties = {
      length: value.length,
      is_palindrome:
        value.toLowerCase() === value.split("").reverse().join("").toLowerCase(),
      unique_characters: new Set(value).size,
      word_count: value.trim().split(/\s+/).length,
      sha256_hash: hashedValue,
      character_frequency_map: getCharacterFrequencyMap(value),
    };
    // Save to database
    const record = await prisma.stringAnalysis.create({
      data: {
        id: hashedValue,
        value,
        ...properties,
      },
    });
      
      // Mock response
      res.status(201).json({
      id: record.id,
      value: record.value,
      properties: {
        length: record.length,
        is_palindrome: record.is_palindrome,
        unique_characters: record.unique_characters,
        word_count: record.word_count,
        sha256_hash: record.sha256_hash,
        character_frequency_map: record.character_frequency_map,
      },
      created_at: record.created_at,
    })
    }catch (err:any) {
        console.error(err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
  });
    }
  },

  retrieveStringByValue: async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { value } = req.params;
    // Logic to retrieve the string analysis by value would go here 
    const hashedValue = generateSHA256Hash(value);
    const record = await prisma.stringAnalysis.findUnique({
      where: { id: hashedValue },
    });
    if (!record) {
      res.status(404).json({ error: "Not Found", message: "String does not exist" });
      return;
    }
    const response: createStringResponse = {
      id: record.id,
      value: record.value,
      properties: {
        length: record.length,
        is_palindrome: record.is_palindrome,
        unique_characters: record.unique_characters,
        word_count: record.word_count,
        sha256_hash: record.sha256_hash,
        character_frequency_map: record.character_frequency_map,
      },
      created_at: record.created_at.toISOString(),
    };
    res.status(200).json(response); 


  },
  retrieveAllStringWithfilter: async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    // Logic to retrieve all string analyses with optional filters would go here
      try {
      const {
        is_palindrome,
        min_length,
        max_length,
        word_count,
        contains_character,
        unique_characters,
      } = req.query;

      // Validate query parameters
      if (
        (is_palindrome && !["true", "false"].includes(is_palindrome.toString())) ||
        (min_length && isNaN(Number(min_length))) ||
        (max_length && isNaN(Number(max_length))) ||
        (word_count && isNaN(Number(word_count))) ||
        (unique_characters && isNaN(Number(unique_characters)))
      ) {
        res
          .status(400)
          .json({ error: "400 Bad Request: Invalid query parameter values or types" });
        return;
      }

      // Build Prisma filter object (top-level fields in your Prisma model)
      const filters: any = {};

      if (is_palindrome !== undefined) filters.is_palindrome = is_palindrome === "true";

      if (min_length || max_length) {
        filters.length = {};
        if (min_length) filters.length.gte = Number(min_length);
        if (max_length) filters.length.lte = Number(max_length);
      }

      if (word_count) filters.word_count = Number(word_count);

      if (unique_characters) filters.unique_characters = Number(unique_characters);

      if (contains_character)
        filters.value = { contains: contains_character as string, mode: "insensitive" };

      // Fetch from DB using correct model name
      const strings = await prisma.stringAnalysis.findMany({
        where: filters,
        orderBy: { created_at: "desc" },
      });

      const formattedData = strings.map((record: any) => ({
      id: record.id,
      value: record.value,
      properties: {
        length: record.length,
        is_palindrome: record.is_palindrome,
        unique_characters: record.unique_characters,
        word_count: record.word_count,
        sha256_hash: record.sha256_hash,
        character_frequency_map: record.character_frequency_map,
      },
      created_at: record.created_at,
    }));

      res.json({
        data: formattedData,
        count: formattedData.length,
        filters_applied: {
          is_palindrome: is_palindrome ? is_palindrome === "true" : undefined,
          min_length: min_length ? Number(min_length) : undefined,
          max_length: max_length ? Number(max_length) : undefined,
          word_count: word_count ? Number(word_count) : undefined,
          unique_characters: unique_characters ? Number(unique_characters) : undefined,
          contains_character: contains_character || undefined,
        },
      })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  },
  filterStringByNaturalLanguage: async (
    req: Request,
    res: Response,
  ): Promise<void> => {},
  
  deleteStringByValue: async (
    req: Request, 
    res: Response): 
    Promise<void> => {},
}
