import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChecklistItem from '../ChecklistItem';

describe('ChecklistItem', () => {
  const item = { id: '1', title: 'Subtask', completed: false };

  it('calls onToggle when icon is pressed', () => {
    const onToggle = jest.fn();
    const { getByA11yLabel } = render(
      <ChecklistItem item={item} onToggle={onToggle} onEdit={() => {}} />
    );

    fireEvent.press(getByA11yLabel('Toggle subtask'));
    expect(onToggle).toHaveBeenCalledWith('1');
  });

  it('calls onEdit with new title when saved', () => {
    const onEdit = jest.fn();
    const { getByA11yLabel, getByDisplayValue } = render(
      <ChecklistItem item={item} onToggle={() => {}} onEdit={onEdit} />
    );

    fireEvent.press(getByA11yLabel('Edit subtask'));
    const input = getByDisplayValue('Subtask');
    fireEvent.changeText(input, 'Updated');
    fireEvent.press(getByA11yLabel('Save subtask'));

    expect(onEdit).toHaveBeenCalledWith('1', 'Updated');
  });
});
