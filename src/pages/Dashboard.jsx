import Layout from '../components/Layout'

const Dashboard = () => {
  return (
    <Layout title="대시보드">
      {/* 통계 카드 영역 (예약용) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* KPI 카드들이 여기에 들어갈 예정 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">통계 카드 예약</p>
        </div>
      </div>

      {/* 그래프 영역 (예약용) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 그래프들이 여기에 들어갈 예정 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600">그래프 예약</p>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
