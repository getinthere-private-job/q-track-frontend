import { useQuery } from '@tanstack/react-query'
import { getSystemCodes } from '../api/systemCodeApi'

/**
 * 시스템 코드 조회 훅
 * @param {string} codeGroup - 코드 그룹 (선택사항)
 * @returns {Object} React Query 결과 객체
 */
export const useSystemCodes = (codeGroup = null) => {
  return useQuery({
    queryKey: ['systemCodes', codeGroup],
    queryFn: () => getSystemCodes(codeGroup),
    staleTime: 10 * 60 * 1000, // 10분간 캐시 유지 (시스템 코드는 변경이 적음)
  })
}
