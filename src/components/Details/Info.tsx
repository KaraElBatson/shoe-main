type InfoProps = {
  name: string;
  price: string;
  description: string;
};

export default function Info({ name, price, description }: InfoProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">{name}</h1>
        <p className="text-2xl font-semibold tracking-wider">{price}</p>
      </div>

      <p className="text-gray-400">{description}</p>
    </div>
  );
}
