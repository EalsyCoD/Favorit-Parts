import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { searchGoods } from '../store/priceSlice'

const DEMO_KEY = '00000000-0000-0000-0000-000000000001'
const KEY_STORAGE = 'favorit-price-key'

function readStoredKey() {
  try {
    return localStorage.getItem(KEY_STORAGE) || DEMO_KEY
  } catch {
    return DEMO_KEY
  }
}

export default function SearchForm() {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.price.status === 'loading')
  const [key, setKey] = useState(readStoredKey)
  const [number, setNumber] = useState('')
  const [brand, setBrand] = useState('')
  const [analogues, setAnalogues] = useState(false)
  const [info, setInfo] = useState(true)
  const [errors, setErrors] = useState({})

  function applyExample(example) {
    setNumber(example.number)
    setBrand(example.brand)
    setAnalogues(example.analogues)
    setErrors({})
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!key.trim()) nextErrors.key = 'Укажите ключ покупателя'
    if (!number.trim()) nextErrors.number = 'Укажите номер детали'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    try {
      localStorage.setItem(KEY_STORAGE, key.trim())
    } catch {
      // Поиск не зависит от сохранения ключа.
    }

    dispatch(searchGoods({
      key: key.trim(),
      number: number.trim(),
      brand: brand.trim(),
      analogues: Boolean(brand.trim()) && analogues,
      info,
    }))
  }

  return (
    <form className="card shadow-sm mb-4" onSubmit={handleSubmit}>
      <div className="card-body">
        <h1 className="h4 mb-1">Проценка запчастей</h1>
        <p className="text-secondary mb-3">
          Поиск цен и остатков по номеру детали. Если производитель неизвестен, оставьте его пустым —
          сервис вернёт все варианты. Аналоги запрашиваются только вместе с производителем.
        </p>

        <div className="mb-3">
          <label className="form-label" htmlFor="client-key">Ключ покупателя</label>
          <input
            id="client-key"
            className={`form-control ${errors.key ? 'is-invalid' : ''}`}
            value={key}
            autoComplete="off"
            onChange={(event) => setKey(event.target.value)}
          />
          <div className="invalid-feedback">{errors.key}</div>
          <div className="form-text">Демонстрационный ключ из описания сервиса уже подставлен.</div>
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="part-number">Номер детали</label>
            <input
              id="part-number"
              className={`form-control ${errors.number ? 'is-invalid' : ''}`}
              value={number}
              autoComplete="off"
              onChange={(event) => setNumber(event.target.value)}
            />
            <div className="invalid-feedback">{errors.number}</div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="part-brand">Производитель</label>
            <input
              id="part-brand"
              className="form-control"
              value={brand}
              autoComplete="off"
              placeholder="Необязательно"
              onChange={(event) => setBrand(event.target.value)}
            />
          </div>
        </div>

        <div className="d-flex flex-column gap-2 mt-3">
          <div className="form-check">
            <input
              id="with-analogues"
              className="form-check-input"
              type="checkbox"
              checked={analogues && brand.trim() !== ''}
              disabled={brand.trim() === ''}
              onChange={(event) => setAnalogues(event.target.checked)}
            />
            <label className="form-check-label" htmlFor="with-analogues">
              Сразу запросить аналоги
            </label>
            {brand.trim() === '' && (
              <div className="form-text">Сначала укажите производителя. Иначе аналоги можно запросить у найденной позиции.</div>
            )}
          </div>
          <div className="form-check">
            <input
              id="with-info"
              className="form-check-input"
              type="checkbox"
              checked={info}
              onChange={(event) => setInfo(event.target.checked)}
            />
            <label className="form-check-label" htmlFor="with-info">
              Показывать невозвратные позиции
            </label>
          </div>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Ищем...' : 'Найти'}
          </button>
          <span className="text-secondary small">Примеры:</span>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => applyExample({ number: '01089', brand: '', analogues: false })}
          >
            01089
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => applyExample({ number: '7160500039S', brand: 'MEYLE', analogues: true })}
          >
            7160500039S / MEYLE
          </button>
        </div>
      </div>
    </form>
  )
}
