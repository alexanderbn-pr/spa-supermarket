import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AcompananteSelector from './AcompananteSelector';
import { Recipe } from '@/types/recipes.types';

const mockAcompananteRecipes: Recipe[] = [
  {
    id: 101,
    name: 'Arroz blanco',
    description: 'Acompanante',
    url: 'https://example.com/arroz',
    type: { id: 5, name: 'Acompañante', description: '' },
    difficulty: { id: 1, name: 'Media', description: '' },
    mealType: { id: 1, name: 'Almuerzo', description: '' },
    healthyLevel: { id: 1, name: 'Saludable', description: '' },
  },
  {
    id: 102,
    name: 'Ensalada verde',
    description: 'Acompanante',
    url: 'https://example.com/ensalada',
    type: { id: 5, name: 'Acompañante', description: '' },
    difficulty: { id: 1, name: 'Fácil', description: '' },
    mealType: { id: 1, name: 'Almuerzo', description: '' },
    healthyLevel: { id: 1, name: 'Saludable', description: '' },
  },
];

describe('AcompananteSelector', () => {
  it('should render unchecked checkbox when disabled', () => {
    const onToggle = vi.fn();
    const onChange = vi.fn();

    render(
      <AcompananteSelector
        moment="comida"
        enabled={false}
        selectedRecipes={[]}
        acompananteOptions={mockAcompananteRecipes}
        onToggle={onToggle}
        onChange={onChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    // MultiSelect should NOT be visible
    expect(screen.queryByText('Seleccionar acompañantes')).not.toBeInTheDocument();
  });

  it('should show MultiSelect when checkbox is checked', () => {
    const onToggle = vi.fn();
    const onChange = vi.fn();

    render(
      <AcompananteSelector
        moment="comida"
        enabled={true}
        selectedRecipes={[]}
        acompananteOptions={mockAcompananteRecipes}
        onToggle={onToggle}
        onChange={onChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    // MultiSelect button should be visible
    expect(screen.getByText('Seleccionar acompañantes')).toBeInTheDocument();
  });

  it('should call onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onChange = vi.fn();

    render(
      <AcompananteSelector
        moment="cena"
        enabled={false}
        selectedRecipes={[]}
        acompananteOptions={mockAcompananteRecipes}
        onToggle={onToggle}
        onChange={onChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith('cena');
  });

  it('should call onChange when recipes are selected', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onChange = vi.fn();

    render(
      <AcompananteSelector
        moment="comida"
        enabled={true}
        selectedRecipes={[]}
        acompananteOptions={mockAcompananteRecipes}
        onToggle={onToggle}
        onChange={onChange}
      />
    );

    // Open the MultiSelect dropdown
    const selectButton = screen.getByText('Seleccionar acompañantes');
    await user.click(selectButton);

    // Click on "Arroz blanco" checkbox in the dropdown
    const arrozCheckbox = screen.getByLabelText('Arroz blanco');
    await user.click(arrozCheckbox);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('comida', [101]);
  });

  it('should show selected recipes count badge', () => {
    render(
      <AcompananteSelector
        moment="comida"
        enabled={true}
        selectedRecipes={[mockAcompananteRecipes[0]]}
        acompananteOptions={mockAcompananteRecipes}
        onToggle={vi.fn()}
        onChange={vi.fn()}
      />
    );

    // The badge should show "1" (one selected)
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should dismiss MultiSelect when enabling and then selecting', () => {
    const onToggle = vi.fn();
    const onChange = vi.fn();

    // Start disabled, then enable
    const { rerender } = render(
      <AcompananteSelector
        moment="comida"
        enabled={false}
        selectedRecipes={[]}
        acompananteOptions={mockAcompananteRecipes}
        onToggle={onToggle}
        onChange={onChange}
      />
    );

    expect(screen.queryByText('Seleccionar acompañantes')).not.toBeInTheDocument();

    // Rerender with enabled=true
    rerender(
      <AcompananteSelector
        moment="comida"
        enabled={true}
        selectedRecipes={[]}
        acompananteOptions={mockAcompananteRecipes}
        onToggle={onToggle}
        onChange={onChange}
      />
    );

    expect(screen.getByText('Seleccionar acompañantes')).toBeInTheDocument();
  });
});
