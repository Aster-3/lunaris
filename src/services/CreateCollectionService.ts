import { copyPickedImage } from '@/utils/copyPickedImage';

export const CreateCollectionService = async (
  imgPath: string,
  imgName: string,
  collectionName: string,
  addCollection: (title: string, imgPath: string) => Promise<true | false>
) => {
  try {
    if (collectionName.trim() === '' || imgPath.trim() === '') {
      alert('Collection name or image cannot be empty!');
      return;
    }
    const copiedPath = await copyPickedImage(imgName, imgPath);
    const result = await addCollection(collectionName, copiedPath);
    return result;
  } catch (err: any) {
    console.error(err);
  }
};
