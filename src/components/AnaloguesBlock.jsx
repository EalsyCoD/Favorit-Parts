import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadAnalogues } from '../store/priceSlice'
import { formatPrice, minOfferPrice } from '../utils/goods'
import ErrorAlert from './ErrorAlert'
import Loader from './Loader'
import WarehousesTable from './WarehousesTable'

const PAGE_SIZE = 20

export default function AnaloguesBlock({ good }) {
  const dispatch = useDispatch()
  const query = useSelector((state) => state.price.query)
  const remote = useSelector((state) => state.price.analogues[good.goodsID])
  const [filter, setFilter] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [openedId, setOpenedId] = useState(null)

  const embedded = Array.isArray(good.analogues)
  const items = embedded ? good.analogues : remote?.items || []
  const status = embedded ? 'succeeded' : remote?.status

  const filtered = useMemo(() => {
    const needle = filter.trim().toLowerCase()
    if (!needle) return items
    return items.filter((item) =>
      `${item.brand} ${item.number} ${item.name}`.toLowerCase().includes(needle)
    )
  }, [filter, items])

  const visible = filtered.slice(0, visibleCount)

  if (!good.brand) return null

  function requestAnalogues() {
    if (!query?.key) return
    dispatch(loadAnalogues({
      goodsID: good.goodsID,
      key: query.key,
      number: good.number,
      brand: good.brand,
      info: Boolean(query.info),
    }))
  }

  return (
    <div className="mt-3 pt-3 border-top">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
        <h3 className="h6 mb-0">Аналоги</h3>
        {!embedded && status !== 'succeeded' && status !== 'loading' && (
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={requestAnalogues}>
            {status === 'failed' ? 'Повторить' : 'Запросить аналоги'}
          </button>
        )}
      </div>

      {status === 'loading' && <Loader text="Загружаем аналоги..." />}
      {status === 'failed' && <ErrorAlert message={remote?.error} />}

      {status === 'succeeded' && items.length === 0 && (
        <p className="text-secondary mb-0">Аналоги не найдены.</p>
      )}

      {status === 'succeeded' && items.length > 0 && (
        <>
          <div className="row g-2 align-items-center mb-2">
            <div className="col-md-6">
              <input
                className="form-control form-control-sm"
                placeholder="Фильтр по бренду, номеру или названию"
                value={filter}
                onChange={(event) => {
                  setFilter(event.target.value)
                  setVisibleCount(PAGE_SIZE)
                }}
              />
            </div>
            <div className="col-md-6 text-md-end text-secondary small">
              {filtered.length} из {items.length}
            </div>
          </div>

          {filtered.length === 0 && (
            <p className="text-secondary mb-0">Ничего не найдено по фильтру.</p>
          )}

          <div className="list-group">
            {visible.map((item, index) => {
              const price = minOfferPrice(item.warehouses)
              const rowKey = `${item.goodsID || item.number}-${index}`
              const opened = openedId === rowKey
              return (
                <div className="list-group-item" key={rowKey}>
                  <button
                    type="button"
                    className="btn btn-link text-start text-decoration-none text-body w-100 p-0"
                    onClick={() => setOpenedId(opened ? null : rowKey)}
                  >
                    <div className="d-flex justify-content-between gap-3">
                      <div>
                        <div className="fw-semibold">
                          {item.brand} <span className="font-monospace fw-normal">{item.number}</span>
                        </div>
                        <div className="small text-secondary">{item.name || 'Без названия'}</div>
                      </div>
                      <div className="text-end text-nowrap">
                        <div>{price == null ? 'Нет в наличии' : formatPrice(price)}</div>
                        <div className="small text-secondary">остаток {item.count}</div>
                      </div>
                    </div>
                  </button>
                  {item.showNotRefund && item.notRefund && (
                    <span className="badge text-bg-warning mt-2">Невозвратная</span>
                  )}
                  {opened && (
                    <div className="mt-2">
                      <WarehousesTable warehouses={item.warehouses} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {visibleCount < filtered.length && (
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm mt-2"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            >
              Показать ещё
            </button>
          )}
        </>
      )}
    </div>
  )
}
