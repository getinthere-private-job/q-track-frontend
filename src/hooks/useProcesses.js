import { useQuery } from '@tanstack/react-query'
import { getProcesses, getProcess } from '../api/processApi'

/**
 * 공정 목록 조회 훅
 * @returns {Object} React Query 결과 객체
 */
export const useProcesses = () => {
  return useQuery({
    queryKey: ['processes'],
    queryFn: getProcesses,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  })
}

/**
 * 공정 상세 조회 훅
 * @param {number} id - 공정 ID
 * @returns {Object} React Query 결과 객체
 */
export const useProcess = (id) => {
  return useQuery({
    queryKey: ['processes', id],
    queryFn: () => getProcess(id),
    enabled: !!id, // id가 있을 때만 실행
    staleTime: 5 * 60 * 1000,
  })
}
