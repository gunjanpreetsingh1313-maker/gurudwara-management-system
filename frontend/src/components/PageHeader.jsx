export default function PageHeader({ title, subtitle, image }) {
  return (
    <div className="relative h-48 md:h-64 bg-navy overflow-hidden">
      {image && <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy/60" />
      <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-gray-300 mt-2 text-lg">{subtitle}</p>}
      </div>
    </div>
  );
}
