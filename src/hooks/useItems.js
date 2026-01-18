import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getItems, getItem, createItem, updateItem, deleteItem } from '../api/itemApi'

/**
 * 부품 목록 조회 훅
 * @returns {Object} React Query 결과 객체
 */
export const useItems = () => {
  return useQuery({
    queryKey: ['items'],
    queryFn: getItems,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  })
}

/**
 * 부품 상세 조회 훅
 * @param {number} id - 부품 ID
 * @returns {Object} React Query 결과 객체
 */
export const useItem = (id) => {
  return useQuery({
    queryKey: ['items', id],
    queryFn: () => getItem(id),
    enabled: !!id, // id가 있을 때만 실행
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * 부품 생성 뮤테이션 훅
 * @returns {Object} React Query mutation 객체
 */
export const useCreateItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      // 부품 목록 캐시 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })
}

/**
 * 부품 수정 뮤테이션 훅
 * @returns {Object} React Query mutation 객체
 */
export const useUpdateItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateItem(id, data),
    onSuccess: (_, variables) => {
      // 부품 목록 및 상세 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['items'] })
      queryClient.invalidateQueries({ queryKey: ['items', variables.id] })
    },
  })
}

/**
 * 부품 삭제 뮤테이션 훅
 * @returns {Object} React Query mutation 객체
 */
export const useDeleteItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      // 부품 목록 캐시 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })
}
