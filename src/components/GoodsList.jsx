import GoodsCard from './GoodsCard'

export default function GoodsList({ goods }) {
  return (
    <div className="d-flex flex-column gap-3">
      <p className="text-secondary mb-0">Найдено позиций: {goods.length}</p>
      {goods.map((good, index) => (
        <GoodsCard good={good} key={`${good.goodsID}-${good.brand}-${index}`} />
      ))}
    </div>
  )
}
