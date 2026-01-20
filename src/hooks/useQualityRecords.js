import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getQualityRecords,
  getQualityRecord,
  createQualityRecord,
  updateQualityRecord,
  deleteQualityRecord,
  evaluateQualityRecord,
  getEvaluationRequired
} from '../api/qualityRecordApi'

/**
 * 품질 기록 목록 조회 훅
 * @param {Object} params - 쿼리 파라미터 (선택사항) - page, size 포함 가능
 * @returns {Object} React Query 결과 객체 (data는 Page 객체)
 */
export const useQualityRecords = (params = {}) => {
  return useQuery({
    queryKey: ['qualityRecords', params],
    queryFn: () => getQualityRecords(params),
    staleTime: 2 * 60 * 1000, // 2분간 캐시 유지
    select: (data) => {
      // data가 Page 객체인 경우 그대로 반환
      if (data && typeof data === 'object' && 'content' in data) {
        return data
      }
      // 하위 호환성을 위해 배열인 경우 Page 객체로 변환
      return {
        content: Array.isArray(data) ? data : [],
        totalElements: Array.isArray(data) ? data.length : 0,
        totalPages: 1,
        size: params.size || 10,
        number: params.page || 0,
        first: true,
        last: true
      }
    }
  })
}

/**
 * 품질 기록 상세 조회 훅
 * @param {number} id - 품질 기록 ID
 * @returns {Object} React Query 결과 객체
 */
export const useQualityRecord = (id) => {
  return useQuery({
    queryKey: ['qualityRecords', id],
    queryFn: () => getQualityRecord(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  })
}

/**
 * 평가 필요 목록 조회 훅
 * @returns {Object} React Query 결과 객체
 */
export const useEvaluationRequired = () => {
  return useQuery({
    queryKey: ['qualityRecords', 'evaluation-required'],
    queryFn: getEvaluationRequired,
    staleTime: 2 * 60 * 1000,
  })
}

/**
 * 품질 기록 생성 뮤테이션 훅
 * @returns {Object} React Query mutation 객체
 */
export const useCreateQualityRecord = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createQualityRecord,
    onSuccess: () => {
      // 목록 캐시 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['qualityRecords'] })
    },
  })
}

/**
 * 품질 기록 수정 뮤테이션 훅
 * @returns {Object} React Query mutation 객체
 */
export const useUpdateQualityRecord = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateQualityRecord(id, data),
    onSuccess: (_, variables) => {
      // 목록 및 상세 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['qualityRecords'] })
      queryClient.invalidateQueries({ queryKey: ['qualityRecords', variables.id] })
    },
  })
}

/**
 * 품질 기록 삭제 뮤테이션 훅
 * @returns {Object} React Query mutation 객체
 */
export const useDeleteQualityRecord = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteQualityRecord,
    onSuccess: () => {
      // 목록 캐시 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['qualityRecords'] })
    },
  })
}

/**
 * 품질 기록 평가 뮤테이션 훅
 * @returns {Object} React Query mutation 객체
 */
export const useEvaluateQualityRecord = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => evaluateQualityRecord(id, data),
    onSuccess: (_, variables) => {
      // 목록 및 상세 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['qualityRecords'] })
      queryClient.invalidateQueries({ queryKey: ['qualityRecords', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['qualityRecords', 'evaluation-required'] })
    },
  })
}
