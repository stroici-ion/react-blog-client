import { RootState } from '../store';

export const selectSearchTags = (state: RootState) => state.search.tags;
export const selectSearch = (state: RootState) => state.search;
