import Layout from '../components/Layout'
import DailyProductionForm from '../components/forms/DailyProductionForm'
import DailyProductionList from '../components/DailyProductionList'

const DataInput = () => {
  return (
    <Layout title="데이터 입력">
      <div className="space-y-6">
        <DailyProductionForm />
        <DailyProductionList />
      </div>
    </Layout>
  )
}

export default DataInput
