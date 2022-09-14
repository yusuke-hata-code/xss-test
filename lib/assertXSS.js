import { detectXSS } from '../../detectXSS';

export const isXSS = async ({ pathName }) => {
  const res = await detectXSS(`http://localhost:7777/${pathName}`);
  // eslint-disable-next-line no-console
  console.log(res);

  return !!res?.length;
};
