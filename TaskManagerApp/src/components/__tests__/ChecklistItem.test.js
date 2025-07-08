import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChecklistItem from '../ChecklistItem';

describe('ChecklistItem', () => {
  const item = { id: '1', title: 'Subtask', completed: false };

  it('calls onToggle when checkbox value changes', () => {
    const onToggle = jest.fn();
    const { getByA11yLabel } = render(
      <ChecklistItem item={item} onToggle={onToggle} onEdit={() => {}} />
    );

    fireEvent(getByA11yLabel('checkbox'), 'valueChange', true);
    expect(onToggle).toHaveBeenCalledWith('1');
  });

  it('calls onEdit with new title when saved', () => {
    const onEdit = jest.fn();
    const { getByText, getByDisplayValue } = render(
      <ChecklistItem item={item} onToggle={() => {}} onEdit={onEdit} />
    );

    fireEvent.press(getByText('Edit'));
    const input = getByDisplayValue('Subtask');
    fireEvent.changeText(input, 'Updated');
    fireEvent.press(getByText('Save'));

    expect(onEdit).toHaveBeenCalledWith('1', 'Updated');
  });
});
