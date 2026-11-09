import { useSelector } from 'react-redux'
import ErrorAlert from './components/ErrorAlert'
import GoodsList from './components/GoodsList'
import Loader from './components/Loader'
import SearchForm from './components/SearchForm'

export default function App() {
  const { status, error, goods, notFound } = useSelector((state) => state.price)

  return (
    <>
      <header className="app-header text-white py-3 mb-4">
        <div className="container d-flex justify-content-between align-items-center">
          <span className="fw-semibold">Favorit Parts</span>
          <span className="small text-white-50">Web-сервис «Проценка»</span>
        </div>
      </header>
      <main className="container pb-5">
        <SearchForm />
        {status === 'idle' && (
          <p className="text-secondary">Введите номер детали и нажмите «Найти».</p>
        )}
        {status === 'loading' && <Loader text="Ищем предложения..." />}
        {status === 'failed' && <ErrorAlert message={error} />}
        {status === 'succeeded' && notFound && (
          <div className="alert alert-warning" role="status">
            Деталь не найдена.
          </div>
        )}
        {status === 'succeeded' && !notFound && <GoodsList goods={goods} />}
      </main>
    </>
  )
}
