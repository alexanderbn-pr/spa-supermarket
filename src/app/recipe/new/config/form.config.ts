import { FromField } from '@/components/ComponentsForm/GenericForm';

export const recipeFormConfig: FromField[] = [
  {
    name: 'name',
    label: 'Nombre',
    mode: 'input',
    inputType: 'text',
  },
  {
    name: 'description',
    label: 'Descripción',
    mode: 'textarea',
  },
  {
    name: 'url',
    label: 'URL de imagen',
    mode: 'input',
    inputType: 'url',
  },
  {
    name: 'type_id',
    label: 'Tipo',
    mode: 'combobox',
    placeholder: 'Escribe o selecciona un tipo',
  },
  {
    name: 'difficulty_id',
    label: 'Tiempo de elaboración',
    mode: 'combobox',
    placeholder: 'Escribe o selecciona un tiempo de elaboración',
  },
  {
    name: 'meal_type_id',
    label: 'Tipo de comida',
    mode: 'combobox',
    placeholder: 'Escribe o selecciona un tipo de comida',
  },
  {
    name: 'healthy_level_id',
    label: 'Nivel saludable',
    mode: 'combobox',
    placeholder: 'Escribe o selecciona un nivel saludable',
  },
  {
    name: 'ingredient_ids',
    label: 'Ingredientes',
    mode: 'multiselect',
    placeholder: 'Selecciona ingredientes',
  },
  {
    name: 'comodin',
    label: 'Receta comodín',
    mode: 'checkbox',
  },
];
