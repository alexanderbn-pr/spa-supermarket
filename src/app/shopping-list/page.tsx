import ShoppingList from '@/components/ShoppingList/ShoppingList';

export const metadata = {
  title: 'Lista de la compra',
  description: 'Gestiona tu lista de la compra',
};

export default function ShoppingListPage() {
  return (
    <div className="flex min-h-[calc(100vh-48px)] flex-col items-center bg-[#f5f5f7] px-4 py-8">
      <h2 className="text-[40px] font-semibold text-[#1d1d1f] mb-8">
        Lista de la compra
      </h2>
      <ShoppingList />
    </div>
  );
}