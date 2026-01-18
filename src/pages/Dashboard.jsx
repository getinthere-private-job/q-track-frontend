import Layout from '../components/Layout'
import StatisticsTable from '../components/StatisticsTable'

const Dashboard = () => {
  return (
    <Layout title="대시보드">
      {/* 통계 테이블 영역 */}
      <div className="space-y-6">
        <StatisticsTable type="process" />
        <StatisticsTable type="item" />
      </div>

      {/* 그래프 영역 (Step 7에서 구현 예정) */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600">그래프 예약 (Step 7)</p>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
