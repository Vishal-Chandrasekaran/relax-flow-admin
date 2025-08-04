import { AppDispatch } from "../store";
import * as userReducer from "../reducers/userReducer";
import * as userApi from '../apiActions/userApi';

// Type definitions for pagination
export interface PaginationParams {
  limit?: number;
  page?: number;
  search?: string;
}

export interface PaginationResponse {
  data: any[];
  pagination?: {
    limit: number;
    page: number;
    search: string;
    totalPages?: number;
    totalItems?: number;
  };
}

// Fetch total count of users (without pagination)
export const fetchUserCount = () => async (dispatch: AppDispatch, getState: any) => {
  try {
    const res = await userApi.getUserList({ page: 1 }); // Large limit to get all users
    
    console.log('Fallback Count API Response:', res);
    
    if (res && res.data && Array.isArray(res.data)) {
      const totalItems = res.data.length;
      const state = getState();
      const currentLimit = state.user.pagination.limit;
      const totalPages = Math.ceil(totalItems / currentLimit);
      
      dispatch(userReducer.setPaginationMetadata({
        totalItems,
        totalPages,
      }));
      
      console.log('Set metadata from fallback:', { totalItems, totalPages });
    }
  } catch (err) {
    console.error('Error fetching user count:', err);
  }
};

// Fetch user list action (with pagination)
export const fetchUserList = (params?: PaginationParams) => async (dispatch: AppDispatch, getState: any) => {
  try {
    dispatch(userReducer.setIsLoading(true));
    
    // Get current pagination state if no params provided
    const state = getState();
    const currentPagination = state.user.pagination;
    const requestParams = params || currentPagination;
    
    // If limit is not provided in requestParams, don't send it to API
    // This allows us to get all results when searching
    const apiParams = { ...requestParams };
    if (!apiParams.limit) {
      delete apiParams.limit;
    }
    
    // Don't send empty search parameter to API
    if (apiParams.search === '') {
      delete apiParams.search;
    }
    
    const res: PaginationResponse = await userApi.getUserList(apiParams);
    
    console.log('API Response:', res); // Debug log
    
    if (res) {
      dispatch(userReducer.setUserList(res.data || []));
      
      // Handle different response structures
      if (res.pagination) {
        // Set pagination parameters (page, limit, search) but preserve totalItems/totalPages
        const { totalItems, totalPages, ...paginationParams } = res.pagination;
        dispatch(userReducer.setPagination(paginationParams));
        
        // Only update metadata if explicitly provided and different from current
        if (totalItems !== undefined && totalPages !== undefined) {
          const currentState = getState();
          if (currentState.user.totalItems !== totalItems || currentState.user.totalPages !== totalPages) {
            dispatch(userReducer.setPaginationMetadata({
              totalItems,
              totalPages,
            }));
          }
        }
      } else if (res.data && Array.isArray(res.data)) {
        // If no pagination metadata in response, just set the pagination parameters
        // Don't calculate totalItems/totalPages from the current page data
        dispatch(userReducer.setPagination(requestParams));
      }
      return res;
    }
  } catch (err: any) {
    console.error(err);
    
    // Handle 404 errors gracefully - treat as empty results
    if (err.response?.status === 404) {
      dispatch(userReducer.setUserList([]));
      dispatch(userReducer.setPaginationMetadata({
        totalItems: 0,
        totalPages: 0,
      }));
      dispatch(userReducer.setError(null)); // Clear error for 404
    } else {
      dispatch(userReducer.setError(err instanceof Error ? err.message : 'An error occurred'));
    }
  } finally {
    dispatch(userReducer.setIsLoading(false));
  }
};

// Create user action
export const createUser = (body: any) => async (dispatch: AppDispatch) => {
  try {
    const res: any = await userApi.createUser(body);
    if (res) {
      dispatch(userReducer.addUser(res.data));
      return res;
    }
  } catch (err) {
    console.error(err);
    // Handle error appropriately
  }
};

// Update user action
export const updateUser = (id: number, body: any) => async (dispatch: AppDispatch) => {
  try {
    const res: any = await userApi.updateUser(id, body);
    if (res) {
      dispatch(userReducer.updateUser({ id, data: res?.data }));
      return res;
    }
  } catch (err) {
    console.error(err);
    // Handle error appropriately
  }
};

// Delete user action
export const deleteUser = (id: number) => async (dispatch: AppDispatch) => {
  try {
    const res: any = await userApi.deleteUser(id);
    if (res) {
      dispatch(userReducer.deleteUser(id));
      return res;
    }
  } catch (err) {
    console.error(err);
    // Handle error appropriately
  }
};

// Pagination actions
export const setPagination = (pagination: PaginationParams) => (dispatch: AppDispatch) => {
  dispatch(userReducer.setPagination(pagination));
};

export const nextPage = () => (dispatch: AppDispatch) => {
  dispatch(userReducer.nextPage());
};

export const prevPage = () => (dispatch: AppDispatch) => {
  dispatch(userReducer.prevPage());
};

export const goToPage = (page: number) => (dispatch: AppDispatch) => {
  dispatch(userReducer.goToPage(page));
};

export const resetPagination = () => (dispatch: AppDispatch) => {
  dispatch(userReducer.resetPagination());
};

export const setPaginationMetadata = (metadata: { totalItems: number; totalPages: number }) => (dispatch: AppDispatch) => {
  dispatch(userReducer.setPaginationMetadata(metadata));
};

// Combined pagination actions that also fetch data
export const nextPageAndFetch = () => async (dispatch: AppDispatch) => {
  dispatch(userReducer.nextPage());
  await dispatch(fetchUserList());
};

export const prevPageAndFetch = () => async (dispatch: AppDispatch) => {
  dispatch(userReducer.prevPage());
  await dispatch(fetchUserList());
};

export const goToPageAndFetch = (page: number) => async (dispatch: AppDispatch) => {
  dispatch(userReducer.goToPage(page));
  await dispatch(fetchUserList());
};

// Search action that updates search and fetches data
export const setSearchAndFetch = (search: string) => async (dispatch: AppDispatch) => {
  // Clear any previous errors
  dispatch(userReducer.setError(null));
  
  // Handle empty or whitespace-only search
  const trimmedSearch = search.trim();
  
  // If search query exists, remove limit to get all matching users
  // If search is empty, include limit for normal pagination
  const paginationParams = trimmedSearch.length > 0 
    ? { search: trimmedSearch, page: 1 } // No limit when searching - get all results
    : { search: '', page: 1, limit: 10 }; // Include limit for normal pagination
  
  dispatch(userReducer.setPagination(paginationParams));
  await dispatch(fetchUserList());
};

// Initialize pagination with count and first page
export const initializePagination = () => async (dispatch: AppDispatch) => {
  try {
    // First get the total count (this sets totalItems and totalPages)
    await dispatch(fetchUserCount());
    
    // Then get the first page of data (this only affects the current page data, not total count)
    await dispatch(fetchUserList());
  } catch (err) {
    console.error('Error initializing pagination:', err);
  }
};
