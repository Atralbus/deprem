import { NextApiRequest, NextApiResponse } from "next";
import { cacheStore } from "./store";

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const hour = (req.query?.hour as string) || "all";
  const data = cacheStore.get(hour);
  console.log(`Data request received, row count: ${data.length}`);

  res.status(200).json(data);
}
