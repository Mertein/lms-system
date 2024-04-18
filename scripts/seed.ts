const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Ciencias de la Computación" },
        { name: "Música" },
        { name: "Fitness" },
        { name: "Fotografía" },
        { name: "Contabilidad" },
        { name: "Ingeniería" },
        { name: "Filmación" },
        { name: "Gaming" },
      ]
    });

    console.log("Success");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();