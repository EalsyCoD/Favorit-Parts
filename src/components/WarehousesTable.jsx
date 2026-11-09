import { useState } from 'react'
import { formatPrice, formatShipment, sortWarehouses } from '../utils/goods'

const PREVIEW_COUNT = 5

export default function WarehousesTable({ warehouses }) {
  const [showAll, setShowAll] = useState(false)
  const rows = sortWarehouses(warehouses || [])

  if (rows.length === 0) {
    return <p className="text-secondary mb-0">На складах нет предложений.</p>
  }

  const visible = showAll ? rows : rows.slice(0, PREVIEW_COUNT)
  const bestPrice = rows.find((row) => row.stock > 0)?.price
  const showNotRefund = rows.some((row) => row.notRefund)

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-sm align-middle mb-2">
          <thead>
            <tr>
              <th>Склад</th>
              <th>Тип</th>
              <th title="Дата отгрузки. Время — до какого часа нужно оформить заказ, чтобы отгрузка прошла в эту дату.">
                Отгрузка
              </th>
              <th className="text-end">Цена</th>
              <th className="text-end">Остаток</th>
              {showNotRefund && <th>Возврат</th>}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, index) => {
              const isBest = row.stock > 0 && row.price === bestPrice
              return (
                <tr key={`${row.id || row.code}-${index}`} className={isBest ? 'table-success' : undefined}>
                  <td>{row.code || '—'}</td>
                  <td>
                    {row.own ? (
                      <span className="badge text-bg-success">Наш склад</span>
                    ) : (
                      <span className="badge text-bg-light border">Поставщик</span>
                    )}
                  </td>
                  <td>{formatShipment(row.shipmentDate)}</td>
                  <td className="text-end text-nowrap">{formatPrice(row.price)}</td>
                  <td className="text-end">{row.stock}</td>
                  {showNotRefund && (
                    <td>
                      {row.showNotRefund && row.notRefund ? (
                        <span className="badge text-bg-warning">Невозврат</span>
                      ) : (
                        '—'
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {rows.length > PREVIEW_COUNT && (
        <button
          type="button"
          className="btn btn-link btn-sm px-0"
          onClick={() => setShowAll((value) => !value)}
        >
          {showAll ? 'Свернуть склады' : `Показать все склады (${rows.length})`}
        </button>
      )}
    </div>
  )
}
