import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// GET all provinsi
router.get("/provinsi", async (req: Request, res: Response) => {
  try {
    const provinsi = await prisma.provinsi.findMany({
      orderBy: { nama: "asc" },
    });
    res.json(provinsi);
  } catch (error) {
    console.error("Error fetching provinsi:", error);
    res.status(500).json({ error: "Failed to fetch provinsi" });
  }
});

// GET kabupaten by provinsi kode
router.get("/kabupaten/:provinsiKode", async (req: Request, res: Response) => {
  try {
    const { provinsiKode } = req.params;
    const kabupaten = await prisma.kabupaten.findMany({
      where: { provinsiKode },
      orderBy: { nama: "asc" },
    });
    res.json(kabupaten);
  } catch (error) {
    console.error("Error fetching kabupaten:", error);
    res.status(500).json({ error: "Failed to fetch kabupaten" });
  }
});

// GET kecamatan by kabupaten kode
router.get("/kecamatan/:kabupatenKode", async (req: Request, res: Response) => {
  try {
    const { kabupatenKode } = req.params;
    const kecamatan = await prisma.kecamatan.findMany({
      where: { kabupatenKode },
      orderBy: { nama: "asc" },
    });
    res.json(kecamatan);
  } catch (error) {
    console.error("Error fetching kecamatan:", error);
    res.status(500).json({ error: "Failed to fetch kecamatan" });
  }
});

// GET desa by kecamatan kode
router.get("/desa/:kecamatanKode", async (req: Request, res: Response) => {
  try {
    const { kecamatanKode } = req.params;
    const desa = await prisma.desa.findMany({
      where: { kecamatanKode },
      orderBy: { nama: "asc" },
    });
    res.json(desa);
  } catch (error) {
    console.error("Error fetching desa:", error);
    res.status(500).json({ error: "Failed to fetch desa" });
  }
});

export default router;
