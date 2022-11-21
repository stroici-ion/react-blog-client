export interface ISearchState {
  searchText?: string;
  sortBy?: SortByEnum;
  tags?: string[];
  currentPage: number;
  limit: number;
}

export enum SortByEnum {
  NEWS = 'news',
  POPULAR = 'popular',
}
