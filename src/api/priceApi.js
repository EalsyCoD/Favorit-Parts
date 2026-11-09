const API_URL = 'http://api.favorit-parts.ru/hs/hsprice/'

export function formatApiError(error) {
  if (error == null || error === '') return 'Неизвестная ошибка сервиса'
  if (typeof error === 'string') return error
  if (Array.isArray(error)) {
    return error.map(formatApiError).filter(Boolean).join('; ')
  }
  if (typeof error === 'object') {
    return Object.values(error).map(formatApiError).filter(Boolean).join('; ')
  }
  return String(error)
}

function buildUrl({ key, number, brand, analogues, info }) {
  const params = new URLSearchParams()
  params.set('key', key.trim())
  params.set('number', number.trim())
  if (brand && brand.trim()) params.set('brand', brand.trim())
  if (brand && brand.trim() && analogues) params.set('analogues', 'on')
  if (info) params.set('info', 'on')
  return `${API_URL}?${params.toString()}`
}

export async function fetchPrice(query) {
  let response
  try {
    response = await fetch(buildUrl(query), {
      method: 'GET',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
  } catch {
    throw new Error('Нет соединения с сервером. Проверьте сеть и повторите запрос.')
  }

  let text = ''
  try {
    text = await response.text()
  } catch {
    throw new Error('Не удалось прочитать ответ сервера.')
  }

  if (!text.trim()) {
    throw new Error('Сервер вернул пустой ответ.')
  }

  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error(
      response.ok
        ? 'Сервер вернул некорректный ответ.'
        : `Ошибка сервера (${response.status}).`
    )
  }

  if (data && Object.prototype.hasOwnProperty.call(data, 'error')) {
    throw new Error(formatApiError(data.error))
  }

  if (!response.ok) {
    throw new Error(`Ошибка сервера (${response.status}).`)
  }

  if (!data || !Array.isArray(data.goods)) {
    throw new Error('В ответе нет списка товаров.')
  }

  return data.goods
}
