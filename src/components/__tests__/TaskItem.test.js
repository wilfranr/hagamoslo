import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskItem from '../TaskItem';

describe('TaskItem', () => {
  it('calls onToggle when pressed', () => {
    const onToggle = jest.fn();
    const task = { id: '1', title: 'Tarea', completed: false };
    const { getByText } = render(<TaskItem task={task} onToggle={onToggle} />);

    fireEvent.press(getByText('Tarea'));
    expect(onToggle).toHaveBeenCalledWith('1');
  });

  it('shows completed style when task completed', () => {
    const task = { id: '2', title: 'Hecho', completed: true };
    const { getByText } = render(<TaskItem task={task} onToggle={() => {}} />);

    const text = getByText('Hecho');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ textDecorationLine: 'line-through' })
      ])
    );
  });
});
