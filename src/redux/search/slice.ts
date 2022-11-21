import { createSlice } from '@reduxjs/toolkit';

import { ISearchState, SortByEnum } from './types';

const initialState: ISearchState = {
  searchText: '',
  sortBy: SortByEnum.NEWS,
  tags: undefined,
  currentPage: 1,
  limit: 10,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setTag(state, { payload }) {
      state.tags = [payload];
    },
    setCurrentPage(state, { payload }) {
      state.currentPage = payload;
    },
    setSortBy(state, { payload }) {
      state.sortBy = payload;
    },

    setSearch(state, action) {},
  },
});

export default searchSlice.reducer;

export const { setTag, setSortBy, setCurrentPage } = searchSlice.actions;
