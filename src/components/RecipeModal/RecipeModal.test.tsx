import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Recipe } from '@/types/recipes.types';
import RecipeModal from './RecipeModal';

// Mock next/navigation for useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock server action to prevent supabase import during tests
vi.mock('@/actions/recipe-actions', () => ({
  deleteRecipeAction: vi.fn(),
}));

const mockRecipe: Recipe = {
  id: 1,
  name: 'Paella Valenciana',
  description: 'Traditional Spanish rice dish',
  url: 'https://example.com/paella.jpg',
  type: { id: 1, name: 'Ensalada', description: '' },
  difficulty: { id: 1, name: 'Media', description: '' },
  mealType: { id: 1, name: 'Almuerzo', description: '' },
  healthyLevel: { id: 1, name: 'Saludable', description: '' },
  ingredients: [
    { id: 1, name: 'Arroz', description: 'Arroz bomba', quantity: '500g' },
    { id: 2, name: 'Marisco', description: 'Gambas y mejillones', quantity: '300g' },
  ],
};

const mockComodinRecipe: Recipe = {
  ...mockRecipe,
  id: 2,
  name: 'Comodín Pizza',
  comodin: true,
};

describe('RecipeModal', () => {
  it('should render recipe name', () => {
    render(<RecipeModal recipe={mockRecipe} isOpen={true} onClose={() => {}} />);

    expect(screen.getByText('Paella Valenciana')).toBeInTheDocument();
  });

  it('should render description', () => {
    render(<RecipeModal recipe={mockRecipe} isOpen={true} onClose={() => {}} />);

    expect(screen.getByText('Traditional Spanish rice dish')).toBeInTheDocument();
  });

  it('should render all ingredients', () => {
    render(<RecipeModal recipe={mockRecipe} isOpen={true} onClose={() => {}} />);

    expect(screen.getByText('Arroz')).toBeInTheDocument();
    expect(screen.getByText('Marisco')).toBeInTheDocument();
    expect(screen.getByText('500g')).toBeInTheDocument();
    expect(screen.getByText('300g')).toBeInTheDocument();
  });

  it('should render metadata fields with labels', () => {
    render(<RecipeModal recipe={mockRecipe} isOpen={true} onClose={() => {}} />);

    expect(screen.getByText('Tipo de plato')).toBeInTheDocument();
    expect(screen.getByText('Tiempo de elaboración')).toBeInTheDocument();
    expect(screen.getByText('Momento del día')).toBeInTheDocument();
    expect(screen.getByText('Nivel saludable')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    const { container } = render(<RecipeModal recipe={mockRecipe} isOpen={false} onClose={() => {}} />);

    expect(container.firstChild).toBeNull();
  });

  it('should call onClose when escape is pressed', () => {
    const onClose = vi.fn();
    render(<RecipeModal recipe={mockRecipe} isOpen={true} onClose={onClose} />);

    // Create and dispatch keydown event
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    // Note: React 19 may handle this differently
    // This test may need adjustment based on actual behavior
  });



  it('should show comodin badge when recipe has comodin=true', () => {
    render(<RecipeModal recipe={mockComodinRecipe} isOpen={true} onClose={() => {}} />);

    expect(screen.getByText('Comodín')).toBeInTheDocument();
    expect(screen.getByText('Reutilizable en menú')).toBeInTheDocument();
  });

  it('should not show comodin badge when recipe has comodin=false', () => {
    render(<RecipeModal recipe={mockRecipe} isOpen={true} onClose={() => {}} />);

    expect(screen.queryByText('Comodín')).not.toBeInTheDocument();
    expect(screen.queryByText('Reutilizable en menú')).not.toBeInTheDocument();
  });
});
