import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-lg font-semibold text-gray-900 mb-6">품질 기록 목록 및 평가</h1>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App
