import { StoreProps } from '../../common/interfaces';
import { getWateredTrees } from './getWateredTrees';
import { isMobile } from 'react-device-detect';
import { loadTreesGeoJson } from './loadTreesGeoJson';

const loadTrees = async () => {
  if (isMobile) {
    return { type: 'FeatureCollection', features: [] };
  } else {
    return await loadTreesGeoJson();
  }
};

export const loadAllData = async (): Promise<{
  wateredTrees: StoreProps['wateredTrees'];
  data: StoreProps['data'];
}> => {
  const [wateredTrees, data] = await Promise.all([
    getWateredTrees(),
    loadTrees(),
  ]);
  return { wateredTrees, data };
};
