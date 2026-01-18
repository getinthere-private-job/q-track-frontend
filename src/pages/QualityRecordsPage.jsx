import Layout from '../components/Layout'
import QualityRecordForm from '../components/forms/QualityRecordForm'
import QualityRecordList from '../components/QualityRecordList'

const QualityRecordsPage = () => {
  return (
    <Layout title="품질 기록">
      <div className="space-y-6">
        <QualityRecordForm />
        <QualityRecordList />
      </div>
    </Layout>
  )
}

export default QualityRecordsPage
