import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800">Q-Track 대시보드</h1>
            <p className="mt-4 text-gray-600">프로젝트가 성공적으로 설정되었습니다!</p>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App