import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskInput from '../TaskInput';

describe('TaskInput', () => {
  it('calls onAdd with trimmed text and clears input', () => {
    const onAdd = jest.fn();
    const { getByPlaceholderText, getByText } = render(<TaskInput onAdd={onAdd} />);

    const input = getByPlaceholderText('Nueva tarea');
    fireEvent.changeText(input, '  Hacer compras  ');
    fireEvent.press(getByText('Agregar'));

    expect(onAdd).toHaveBeenCalledWith('Hacer compras');
    expect(input.props.value).toBe('');
  });
});
