import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchPrice } from '../api/priceApi'
import { isEmptyGood, isNotFoundResult, normalizeGoods } from '../utils/goods'

export const searchGoods = createAsyncThunk(
  'price/search',
  async (query, { rejectWithValue }) => {
    try {
      const goods = normalizeGoods(await fetchPrice(query))
      return { query, goods }
    } catch (error) {
      return rejectWithValue(error.message || 'Не удалось выполнить запрос')
    }
  }
)

export const loadAnalogues = createAsyncThunk(
  'price/loadAnalogues',
  async ({ goodsID, key, number, brand, info }, { rejectWithValue }) => {
    try {
      const goods = await fetchPrice({
        key,
        number,
        brand,
        analogues: true,
        info,
      })
      const source =
        goods.find((item) => item.goodsID === goodsID) ||
        goods.find((item) => item.brand === brand) ||
        goods[0]
      const rawItems = source && !isEmptyGood(normalizeGoods([source])[0]) && Array.isArray(source.analogues)
        ? source.analogues
        : []
      return { goodsID, items: normalizeGoods(rawItems) }
    } catch (error) {
      return rejectWithValue({
        goodsID,
        message: error.message || 'Не удалось загрузить аналоги',
      })
    }
  }
)

const initialState = {
  status: 'idle',
  error: null,
  goods: [],
  notFound: false,
  query: null,
  analogues: {},
}

const priceSlice = createSlice({
  name: 'price',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchGoods.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.goods = []
        state.notFound = false
        state.analogues = {}
      })
      .addCase(searchGoods.fulfilled, (state, action) => {
        const { query, goods } = action.payload
        state.status = 'succeeded'
        state.query = query
        state.notFound = isNotFoundResult(goods)
        state.goods = state.notFound ? [] : goods
      })
      .addCase(searchGoods.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message || 'Не удалось выполнить запрос'
        state.goods = []
        state.notFound = false
      })
      .addCase(loadAnalogues.pending, (state, action) => {
        const { goodsID } = action.meta.arg
        state.analogues[goodsID] = {
          status: 'loading',
          error: null,
          items: [],
        }
      })
      .addCase(loadAnalogues.fulfilled, (state, action) => {
        const { goodsID, items } = action.payload
        state.analogues[goodsID] = {
          status: 'succeeded',
          error: null,
          items,
        }
      })
      .addCase(loadAnalogues.rejected, (state, action) => {
        const goodsID = action.payload?.goodsID || action.meta.arg.goodsID
        state.analogues[goodsID] = {
          status: 'failed',
          error: action.payload?.message || action.error.message || 'Не удалось загрузить аналоги',
          items: [],
        }
      })
  },
})

export default priceSlice.reducer
