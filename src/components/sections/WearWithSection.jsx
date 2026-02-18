import ProductCard from '../common/ProductCard';

const WearWithSection = ({ products }) => {
  if (!products?.length) return null;

  return (
    <section className="mt-24 border-t border-black/10 pt-20 px-4 sm:px-8">
      <div className="max-w-screen-2xl mx-auto">
        <h2 className="text-3xl font-light tracking-[0.1em] text-center mb-4 uppercase">Complete The Look</h2>
        <p className="text-center text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-16">
          Curated pairings selected by our stylists
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {products.map((p) => (
            <ProductCard key={p._id || p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WearWithSection;
