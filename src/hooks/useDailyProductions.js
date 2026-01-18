import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getDailyProductions,
  getDailyProduction,
  createDailyProduction,
  updateDailyProduction,
  deleteDailyProduction
} from '../api/dailyProductionApi'

/**
 * 일별 생산 데이터 목록 조회 훅
 * @param {Object} params - 쿼리 파라미터 (선택사항)
 * @returns {Object} React Query 결과 객체
 */
export const useDailyProductions = (params = {}) => {
  return useQuery({
    queryKey: ['dailyProductions', params],
    queryFn: () => getDailyProductions(params),
    staleTime: 2 * 60 * 1000, // 2분간 캐시 유지
  })
}

/**
 * 일별 생산 데이터 상세 조회 훅
 * @param {number} id - 일별 생산 데이터 ID
 * @returns {Object} React Query 결과 객체
 */
export const useDailyProduction = (id) => {
  return useQuery({
    queryKey: ['dailyProductions', id],
    queryFn: () => getDailyProduction(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  })
}

/**
 * 일별 생산 데이터 생성 뮤테이션 훅
 * @returns {Object} React Query mutation 객체
 */
export const useCreateDailyProduction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDailyProduction,
    onSuccess: () => {
      // 목록 캐시 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['dailyProductions'] })
    },
  })
}

/**
 * 일별 생산 데이터 수정 뮤테이션 훅
 * @returns {Object} React Query mutation 객체
 */
export const useUpdateDailyProduction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateDailyProduction(id, data),
    onSuccess: (_, variables) => {
      // 목록 및 상세 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['dailyProductions'] })
      queryClient.invalidateQueries({ queryKey: ['dailyProductions', variables.id] })
    },
  })
}

/**
 * 일별 생산 데이터 삭제 뮤테이션 훅
 * @returns {Object} React Query mutation 객체
 */
export const useDeleteDailyProduction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDailyProduction,
    onSuccess: () => {
      // 목록 캐시 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['dailyProductions'] })
    },
  })
}
