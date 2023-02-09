import axios, { AxiosResponse } from "axios";
import { jsonUrl } from "../../constants";
import { cacheStore } from "./store";
import { NextApiRequest, NextApiResponse } from "next";

const fetchData = async (): Promise<AxiosResponse<any, any> | undefined> => {
  return axios.get(`${jsonUrl}?ts=${Date.now()}`, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log(`Cache request received, fetching data...`);
    const response = await fetchData();

    if (!response) {
      res.status(500).json({ error: "No response" });
      return;
    }

    cacheStore.cache(response.data);

    res.status(200).json({ message: "cached" });

    console.log(`Cache request completed, data cached.`);
  } catch (error) {
    res.status(500).json({ error });
  }
}
