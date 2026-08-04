import 'dotenv/config';
import * as bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding fishing spots...');

  const passwordHash = await bcrypt.hash('seed-password-123', 10);

  const owner = await prisma.user.upsert({
    where: { email: 'seed@fishguide.app' },
    update: {},
    create: {
      email: 'seed@fishguide.app',
      name: 'FishGuide Seed',
      passwordHash,
      role: 'COLLABORATOR',
    },
  });

  const speciesMap: Record<string, string> = {};
  for (const species of [
    { name: 'Robalo', scientificName: 'Centropomus parallelus', bestBait: 'Tainha viva', habitat: 'Estuários e mangues', feeding: 'Piscívoro', averageWeight: 5, averageLength: 70, bestSeason: 'Março a Junho', bestTide: 'Enchente', bestMoon: 'Lua cheia' },
    { name: 'Corvina', scientificName: 'Micropogonias furnieri', bestBait: 'Camarão', habitat: 'Fundo de areia/lama', feeding: 'Bentívoro', averageWeight: 2.5, averageLength: 60, bestSeason: 'Outono e Inverno', bestTide: 'Vazante', bestMoon: 'Lua nova' },
    { name: 'Garoupa', scientificName: 'Epinephelus marginatus', bestBait: 'Sardinha', habitat: 'Costões e naufrágios', feeding: 'Piscívoro', averageWeight: 8, averageLength: 90, bestSeason: 'Verão', bestTide: 'Qualquer', bestMoon: 'Lua nova' },
    { name: 'Tainha', scientificName: 'Mugil liza', bestBait: 'Isca natural', habitat: 'Praias e desembocaduras', feeding: 'Detritívoro', averageWeight: 2, averageLength: 50, bestSeason: 'Maio a Agosto', bestTide: 'Enchente', bestMoon: 'Lua cheia' },
    { name: 'Pescada', scientificName: 'Cynoscion acoupa', bestBait: 'Camarão', habitat: 'Bocas de rio e águas costeiras', feeding: 'Piscívoro', averageWeight: 6, averageLength: 80, bestSeason: 'Primavera', bestTide: 'Vazante', bestMoon: 'Lua nova' },
    { name: 'Tucunaré', scientificName: 'Cichla ocellaris', bestBait: 'Isca artificial', habitat: 'Águas calmas e represas', feeding: 'Piscívoro', averageWeight: 3, averageLength: 55, bestSeason: 'Outono', bestTide: 'Não se aplica', bestMoon: 'Lua minguante' },
    { name: 'Robalo-peva', scientificName: 'Centropomus undecimalis', bestBait: 'Corvina pequena', habitat: 'Manguezais e rios', feeding: 'Piscívoro', averageWeight: 7, averageLength: 100, bestSeason: 'Primavera e Verão', bestTide: 'Enchente', bestMoon: 'Lua cheia' },
    { name: 'Carapau', scientificName: 'Caranx hippos', bestBait: 'Colher de metal', habitat: 'Arrebentação e águas abertas', feeding: 'Piscívoro', averageWeight: 4, averageLength: 70, bestSeason: 'Verão', bestTide: 'Maré alta', bestMoon: 'Lua cheia' },
  ]) {
    let created = await prisma.species.findFirst({ where: { name: species.name } });
    if (!created) {
      created = await prisma.species.create({ data: species });
    }
    speciesMap[species.name] = created.id;
  }

  const spots = [
    {
      name: 'Praia do Saco',
      latitude: -11.1069,
      longitude: -37.1289,
      description: 'Fundo de areia com bancos de camarão. Boa para robalo na maré enchendo.',
      spotType: 'BEACH' as const,
      accessType: 'public',
      structure: 'Praia aberta, estacionamento próximo',
      species: ['Robalo', 'Tainha'],
    },
    {
      name: 'Costão da Ilha',
      latitude: -11.055,
      longitude: -37.056,
      description: 'Pesqueiro de pedra ao largo da ilha. Corvina e garoupa em profundidade.',
      spotType: 'ROCKY_SHORE' as const,
      accessType: 'public',
      structure: 'Costão rochoso, acesso por embarcação',
      species: ['Corvina', 'Garoupa'],
    },
    {
      name: 'Pontal Sul',
      latitude: -11.116,
      longitude: -37.153,
      description: 'Pesqueiro clássico do sul. Tainha na primavera e robalo o ano todo.',
      spotType: 'BEACH' as const,
      accessType: 'public',
      structure: 'Pontal com correnteza moderada',
      species: ['Tainha', 'Robalo'],
    },
    {
      name: 'Rio Vaza Barris',
      latitude: -11.163,
      longitude: -37.087,
      description: 'Manguezal com estuário. Pescada e corvina na maré de vazante.',
      spotType: 'MANGROVE' as const,
      accessType: 'boat',
      structure: 'Canal estreito, navegação por canoa',
      species: ['Pescada', 'Corvina'],
    },
    {
      name: 'Represa do Sítio',
      latitude: -11.078,
      longitude: -37.208,
      description: 'Represa de água doce com tucunaré e tilápia.',
      spotType: 'DAM' as const,
      accessType: 'private',
      privacy: 'friends' as const,
      structure: 'Margens com vegetação',
      species: ['Robalo', 'Tucunaré'],
    },
    {
      name: 'Canal do Atalaia',
      latitude: -11.139,
      longitude: -37.049,
      description: 'Canal natural entre mangues. Ótima pesca em maré enchendo.',
      spotType: 'CANAL' as const,
      accessType: 'public',
      structure: 'Canal com forte corrente',
      species: ['Corvina', 'Pescada'],
    },
  ];

  for (const spot of spots) {
    const { species: spotSpecies, ...data } = spot;

    const existing = await prisma.fishingSpot.findFirst({
      where: { name: spot.name, deletedAt: null },
    });

    if (existing) {
      console.log(`⚠️  Pesqueiro já existe: ${spot.name}`);
      continue;
    }

    const created = await prisma.fishingSpot.create({
      data: {
        ...data,
        rating: 4.5,
        photos: [],
        userId: owner.id,
      },
    });

    await prisma.location.upsert({
      where: { spotId: created.id },
      update: {},
      create: {
        spotId: created.id,
        latitude: spot.latitude,
        longitude: spot.longitude,
      },
    });

    for (const speciesName of spotSpecies) {
      await prisma.speciesOnSpot.upsert({
        where: { speciesId_spotId: { speciesId: speciesMap[speciesName], spotId: created.id } },
        update: {},
        create: { speciesId: speciesMap[speciesName], spotId: created.id },
      });
    }

    console.log(`✅ Pesqueiro criado: ${spot.name}`);
  }

  console.log('🌱 Seed concluído.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
