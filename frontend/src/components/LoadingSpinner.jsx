export default function LoadingSpinner({ size = 'md' }) {
  const sizes = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-16 w-16' };
  return (
    <div className="flex justify-center items-center py-12">
      <div className={`${sizes[size]} border-4 border-saffron border-t-transparent rounded-full animate-spin`} />
    </div>
  );
}
