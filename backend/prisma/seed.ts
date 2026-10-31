import { PrismaClient, Role, Sex, Species } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const vaccines = [
  { name: "Steklina", species: Species.DOG, intervalMonths: 12 },
  { name: "Kombinirano cepivo DHPPi", species: Species.DOG, intervalMonths: 12 },
  { name: "Leptospiroza", species: Species.DOG, intervalMonths: 12 },
  { name: "Steklina", species: Species.CAT, intervalMonths: 12 },
  { name: "Kombinirano cepivo RCP", species: Species.CAT, intervalMonths: 12 },
  { name: "Levkemija FeLV", species: Species.CAT, intervalMonths: 12 },
  { name: "Miksomatoza", species: Species.RABBIT, intervalMonths: 6 },
  { name: "RHD", species: Species.RABBIT, intervalMonths: 12 },
  { name: "Steklina", species: Species.FERRET, intervalMonths: 12 },
  { name: "Pasja kuga", species: Species.FERRET, intervalMonths: 12 },
];

const staff = [
  { firstName: "Alenka", lastName: "Kovač", email: "admin@petalog.test", role: Role.ADMIN },
  { firstName: "Marko", lastName: "Novak", email: "veterinar@petalog.test", role: Role.VETERINARIAN },
  { firstName: "Tina", lastName: "Zupan", email: "receptor@petalog.test", role: Role.RECEPTIONIST },
];

const owners = [
  {
    firstName: "Ana",
    lastName: "Horvat",
    email: "lastnik@petalog.test",
    phone: "041 123 456",
    animals: [
      {
        name: "Luna",
        species: Species.DOG,
        breed: "Labradec",
        sex: Sex.FEMALE,
        dateOfBirth: "2021-04-12",
        microchipNumber: "705000000000001",
      },
      {
        name: "Muri",
        species: Species.CAT,
        breed: "Evropska kratkodlaka",
        sex: Sex.MALE,
        dateOfBirth: "2019-09-03",
        microchipNumber: "705000000000002",
      },
      { name: "Snežko", species: Species.RABBIT, sex: Sex.MALE, dateOfBirth: "2024-02-20" },
      { name: "Piko", species: Species.HAMSTER, sex: Sex.UNKNOWN, dateOfBirth: "2025-11-15" },
    ],
  },
  {
    firstName: "Luka",
    lastName: "Krajnc",
    email: "lastnik2@petalog.test",
    phone: "031 654 321",
    animals: [
      {
        name: "Rex",
        species: Species.DOG,
        breed: "Nemški ovčar",
        sex: Sex.MALE,
        dateOfBirth: "2018-06-30",
        microchipNumber: "705000000000003",
      },
      { name: "Mici", species: Species.CAT, sex: Sex.FEMALE },
      { name: "Pepi", species: Species.GUINEA_PIG, sex: Sex.FEMALE, dateOfBirth: "2024-08-01" },
      {
        name: "Ferko",
        species: Species.FERRET,
        sex: Sex.MALE,
        dateOfBirth: "2023-05-10",
        microchipNumber: "705000000000004",
      },
      {
        name: "Kiki",
        species: Species.BIRD,
        breed: "Skobčevka",
        sex: Sex.UNKNOWN,
        dateOfBirth: "2025-03-22",
      },
    ],
  },
];

async function main() {
  const password = process.env.SEED_PASSWORD;
  if (!password) {
    throw new Error("SEED_PASSWORD is not set");
  }
  const passwordHash = await bcrypt.hash(password, 10);

  for (const vaccine of vaccines) {
    await prisma.vaccine.upsert({
      where: { name_species: { name: vaccine.name, species: vaccine.species } },
      update: {},
      create: vaccine,
    });
  }

  for (const user of staff) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { ...user, passwordHash },
    });
  }

  for (const { animals, ...owner } of owners) {
    const { id: ownerId } = await prisma.user.upsert({
      where: { email: owner.email },
      update: {},
      create: { ...owner, role: Role.OWNER, passwordHash },
    });

    for (const { dateOfBirth, ...animal } of animals) {
      const existing = await prisma.animal.findFirst({ where: { ownerId, name: animal.name } });
      if (!existing) {
        await prisma.animal.create({
          data: {
            ...animal,
            ownerId,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          },
        });
      }
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
