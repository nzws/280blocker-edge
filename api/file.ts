import { promises } from 'fs';
import got from 'got';
import { NowRequest, NowResponse } from '@vercel/node';

const FILE_PATH = '.cache';
const CACHE_DAYS = 7;

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const d = new Date();
  const num = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;

  try {
    const { mtime } = await promises.stat(FILE_PATH);
    const updatedAt = new Date(mtime);

    if (d.getTime() - updatedAt.getTime() < 1000 * 60 * 60 * 24 * CACHE_DAYS) {
      console.log('cached');
      const body = await promises.readFile(FILE_PATH);

      res.setHeader('Content-Type', 'text/plain');
      res.send(body);
      return;
    }
  } catch (e) {
    //
  }

  console.log('not cached');
  const { body } = await got(
    `https://280blocker.net/files/280blocker_adblock_${num}.txt`
  );
  await promises.writeFile(FILE_PATH, body);

  res.setHeader('Content-Type', 'text/plain');
  res.send(body);
};
