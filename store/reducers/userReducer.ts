/* eslint-disable @typescript-eslint/no-explicit-any */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// Enhanced pagination interface with additional properties
export interface PaginationState {
  limit?: number; // Made optional to support search without limit
  page: number;
  search: string;
}

export interface UserState {
  userList: any[];
  pagination: PaginationState;
  isLoading: boolean;
  error?: string | null;
  totalPages?: number;
  totalItems?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

const initialState: UserState = {
  userList: [],
  pagination: {
    limit: 10,
    page: 1,
    search: '',
  },
  isLoading: false,
  error: null,
  totalPages: 0,
  totalItems: 0,
  hasNextPage: false,
  hasPrevPage: false,
};
  
  export const userSlice = createSlice({
    initialState,
    name: 'user',
    reducers: {
      setUserList: (state, action: PayloadAction<any[]>) => {
        state.userList = action.payload;
      },
      setPagination: (
        state,
        action: PayloadAction<Partial<PaginationState>>
      ) => {
        state.pagination = {
          ...state.pagination,
          ...action.payload,
        };
        
        // If limit is undefined, we're in search mode - disable pagination
        if (state.pagination.limit === undefined) {
          state.hasPrevPage = false;
          state.hasNextPage = false;
        } else {
          // Update hasNextPage and hasPrevPage based on current page
          // Don't recalculate totalPages here as it should only be set by fetchUserCount
          state.hasPrevPage = state.pagination.page > 1;
          if (state.totalPages) {
            state.hasNextPage = state.pagination.page < state.totalPages;
          }
        }
        
        console.log('setPagination:', { 
          currentPage: state.pagination.page, 
          totalPages: state.totalPages,
          limit: state.pagination.limit,
          hasPrevPage: state.hasPrevPage, 
          hasNextPage: state.hasNextPage 
        });
      },
      nextPage: (state) => {
        // Don't allow pagination if limit is undefined (search mode)
        if (state.pagination.limit === undefined) {
          return;
        }
        
        if (state.hasNextPage) {
          state.pagination.page += 1;
          state.hasPrevPage = state.pagination.page > 1;
          if (state.totalPages) {
            state.hasNextPage = state.pagination.page < state.totalPages;
          }
          
          console.log('nextPage:', { 
            currentPage: state.pagination.page, 
            totalPages: state.totalPages, 
            hasPrevPage: state.hasPrevPage, 
            hasNextPage: state.hasNextPage 
          });
        }
      },
      prevPage: (state) => {
        // Don't allow pagination if limit is undefined (search mode)
        if (state.pagination.limit === undefined) {
          return;
        }
        
        if (state.hasPrevPage) {
          state.pagination.page = Math.max(1, state.pagination.page - 1);
          state.hasPrevPage = state.pagination.page > 1;
          if (state.totalPages) {
            state.hasNextPage = state.pagination.page < state.totalPages;
          }
          
          console.log('prevPage:', { 
            currentPage: state.pagination.page, 
            totalPages: state.totalPages, 
            hasPrevPage: state.hasPrevPage, 
            hasNextPage: state.hasNextPage 
          });
        }
      },
      goToPage: (state, action: PayloadAction<number>) => {
        // Don't allow pagination if limit is undefined (search mode)
        if (state.pagination.limit === undefined) {
          return;
        }
        
        const page = Math.max(1, action.payload);
        state.pagination.page = page;
        state.hasPrevPage = page > 1;
        if (state.totalPages) {
          state.hasNextPage = page < state.totalPages;
        }
        
        console.log('goToPage:', { 
          currentPage: state.pagination.page, 
          totalPages: state.totalPages, 
          hasPrevPage: state.hasPrevPage, 
          hasNextPage: state.hasNextPage 
        });
      },
      setPaginationWithTotal: (
        state,
        action: PayloadAction<{
          pagination: Partial<PaginationState>;
          totalItems: number;
          totalPages: number;
        }>
      ) => {
        const { pagination, totalItems, totalPages } = action.payload;
        state.pagination = {
          ...state.pagination,
          ...pagination,
        };
        // Update root-level metadata
        state.totalItems = totalItems;
        state.totalPages = totalPages;
        // Update navigation flags
        state.hasPrevPage = state.pagination.page > 1;
        state.hasNextPage = state.pagination.page < totalPages;
        
        console.log('setPaginationWithTotal:', { 
          currentPage: state.pagination.page, 
          totalPages, 
          hasPrevPage: state.hasPrevPage, 
          hasNextPage: state.hasNextPage 
        });
      },
      resetPagination: (state) => {
        state.pagination = {
          ...initialState.pagination,
        };
        // Restore pagination flags
        state.hasPrevPage = false;
        state.hasNextPage = false;
      },
      setIsLoading: (state, action: PayloadAction<boolean>) => {
        state.isLoading = action.payload;
      },
      setError: (state, action: PayloadAction<string | null>) => {
        state.error = action.payload;
      },
      setPaginationMetadata: (
        state,
        action: PayloadAction<{
          totalItems: number;
          totalPages: number;
        }>
      ) => {
        const { totalItems, totalPages } = action.payload;
        state.totalItems = totalItems;
        state.totalPages = totalPages;
        
        // Update navigation flags based on search mode
        if (state.pagination.limit === undefined) {
          // Search mode - disable pagination
          state.hasPrevPage = false;
          state.hasNextPage = false;
        } else {
          // Normal pagination mode
          state.hasPrevPage = state.pagination.page > 1;
          state.hasNextPage = state.pagination.page < totalPages;
        }
        
        console.log('setPaginationMetadata:', { 
          currentPage: state.pagination.page, 
          totalPages, 
          totalItems,
          limit: state.pagination.limit,
          hasPrevPage: state.hasPrevPage, 
          hasNextPage: state.hasNextPage 
        });
      },
      addUser: (state, action: PayloadAction<any>) => {
        state.userList.push(action.payload);
      },
      updateUser: (state, action: PayloadAction<{ id: number; data: any }>) => {
        const { id, data } = action.payload;
        const index = state.userList.findIndex(user => user.id === id);
        if (index !== -1) {
          state.userList[index] = { ...state.userList[index], ...data };
        }
      },
      deleteUser: (state, action: PayloadAction<number>) => {
        state.userList = state.userList.filter(user => user.id !== action.payload);
      }
    }
  });
  export const { 
    setUserList, 
    setPagination, 
    nextPage, 
    prevPage, 
    goToPage, 
    setPaginationWithTotal, 
    setPaginationMetadata,
    resetPagination, 
    setIsLoading, 
    setError, 
    addUser, 
    updateUser, 
    deleteUser 
  } = userSlice.actions;
  
  export default userSlice.reducer;
  