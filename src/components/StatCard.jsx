const StatCard = ({ title, value, unit = '', isNg = false, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border border-gray-200 min-h-[120px] flex flex-col justify-between ${className}`}>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${isNg ? 'text-red-600' : 'text-gray-900'}`}>
          {value}
        </span>
        {unit && <span className="text-xs text-gray-500">{unit}</span>}
      </div>
    </div>
  )
}

export default StatCard
