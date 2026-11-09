const EMPTY_GOODS_ID = '00000000-0000-0000-0000-000000000000'

function normalizeWarehouse(raw) {
  return {
    code: raw?.code || '',
    id: raw?.id || '',
    own: raw?.own === true,
    shipmentDate: raw?.shipmentDate || '',
    price: Number(raw?.price) || 0,
    stock: Number(raw?.stock) || 0,
    notRefund: raw?.notRefund === true,
    showNotRefund: Object.prototype.hasOwnProperty.call(raw || {}, 'notRefund'),
  }
}

export function normalizeGood(raw) {
  const hasAnalogues = Array.isArray(raw?.analogues)
  return {
    goodsID: raw?.goodsID || '',
    brand: raw?.brand || '',
    number: raw?.number || '',
    name: raw?.name || '',
    count: Number(raw?.count) || 0,
    rate: Number(raw?.rate) || 0,
    notRefund: raw?.notRefund === true,
    showNotRefund: Object.prototype.hasOwnProperty.call(raw || {}, 'notRefund'),
    warehouses: Array.isArray(raw?.warehouses) ? raw.warehouses.map(normalizeWarehouse) : [],
    analogues: hasAnalogues ? raw.analogues.map(normalizeGood) : null,
  }
}

export function normalizeGoods(list) {
  return (Array.isArray(list) ? list : []).map(normalizeGood)
}

export function isEmptyGood(good) {
  if (!good) return true
  return (
    good.goodsID === EMPTY_GOODS_ID &&
    !good.brand &&
    !good.number &&
    !good.name
  )
}

export function isNotFoundResult(goods) {
  if (!Array.isArray(goods) || goods.length === 0) return true
  return goods.length === 1 && isEmptyGood(goods[0])
}

export function sortWarehouses(warehouses) {
  return [...warehouses].sort((a, b) => {
    const stockOrder = (a.stock > 0 ? 0 : 1) - (b.stock > 0 ? 0 : 1)
    if (stockOrder !== 0) return stockOrder
    if (a.price !== b.price) return a.price - b.price
    return String(a.shipmentDate).localeCompare(String(b.shipmentDate))
  })
}

export function minOfferPrice(warehouses) {
  const prices = warehouses.filter((item) => item.stock > 0).map((item) => item.price)
  if (prices.length === 0) return null
  return Math.min(...prices)
}

export function formatPrice(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatShipment(value) {
  if (!value) return '—'
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/)
  if (!match) return value
  const [, year, month, day, hour, minute] = match
  return `${day}.${month}.${year}, до ${hour}:${minute}`
}
