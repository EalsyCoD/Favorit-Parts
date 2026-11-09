import AnaloguesBlock from './AnaloguesBlock'
import WarehousesTable from './WarehousesTable'
import { formatPrice, minOfferPrice } from '../utils/goods'

export default function GoodsCard({ good }) {
  const price = minOfferPrice(good.warehouses)

  return (
    <article className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between gap-3">
          <div>
            <div className="text-primary fw-semibold">{good.brand || 'Производитель не указан'}</div>
            <h2 className="h5 mt-1 mb-1">{good.name || 'Без названия'}</h2>
            <div className="font-monospace">{good.number || '—'}</div>
          </div>
          <div className="text-md-end">
            <div className="fs-5">{price == null ? 'Нет в наличии' : formatPrice(price)}</div>
            <div className="small text-secondary">
              {price == null ? `остаток ${good.count}` : 'минимальная цена склада'}
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 my-3">
          <span className={`badge border ${good.count > 0 ? 'text-bg-light' : 'text-bg-secondary'}`}>
            Остаток: {good.count}
          </span>
          <span className="badge text-bg-light border">Кратность: {good.rate || '—'}</span>
          {good.showNotRefund && good.notRefund && (
            <span className="badge text-bg-warning">Невозвратная позиция</span>
          )}
        </div>

        <WarehousesTable warehouses={good.warehouses} />
        <AnaloguesBlock good={good} />
      </div>
    </article>
  )
}
