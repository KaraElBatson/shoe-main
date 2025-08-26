import data from '../../mock/options.json';

export default function Options() {
  return (
    <div className="mt-6 flex flex-col gap-6">
      <h2 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">243 Options</h2>

      <div className="no-scrollbar flex max-h-60 flex-col gap-6 overflow-y-auto">
        {data.map((shoe, index) => (
          <ShoeCard key={index} name={shoe.name} price={shoe.price} img={shoe.img} />
        ))}
      </div>
    </div>
  );
}

type ShoeCardProps = {
  name: string;
  price: string;
  img: string;
};

function ShoeCard({ name, price, img }: ShoeCardProps) {
  return (
    <div className="flex gap-6">
      <img
        src={img}
        alt={name}
        className="h-16 w-32 rounded-md border border-gray-200 bg-gray-100 object-cover object-center"
      />
      <div className="flex flex-col justify-center">
        <h3 className="font-medium">{name}</h3>
        <p className="text-gray-400">{price}</p>
      </div>
    </div>
  );
}
