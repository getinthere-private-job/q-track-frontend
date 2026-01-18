import { useQuery } from '@tanstack/react-query'
import { getStatisticsByProcess, getStatisticsByItem } from '../api/statisticsApi'

/**
 * 공정별 통계 조회 훅
 * @param {Object} params - 쿼리 파라미터 { startDate?, endDate? }
 * @returns {Object} React Query 결과 객체
 */
export const useStatisticsByProcess = (params = {}) => {
  return useQuery({
    queryKey: ['statisticsByProcess', params],
    queryFn: () => getStatisticsByProcess(params),
    staleTime: 2 * 60 * 1000, // 2분간 캐시 유지
  })
}

/**
 * 부품별 통계 조회 훅
 * @param {Object} params - 쿼리 파라미터 { startDate?, endDate? }
 * @returns {Object} React Query 결과 객체
 */
export const useStatisticsByItem = (params = {}) => {
  return useQuery({
    queryKey: ['statisticsByItem', params],
    queryFn: () => getStatisticsByItem(params),
    staleTime: 2 * 60 * 1000, // 2분간 캐시 유지
  })
}
