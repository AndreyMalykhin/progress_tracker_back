import sharp from "sharp";

type IImgProcessor = typeof sharp;

function makeImgProcessor(): IImgProcessor {
  sharp.cache(false);
  return sharp;
}

export { IImgProcessor, makeImgProcessor };
