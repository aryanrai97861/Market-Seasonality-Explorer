import React from 'react';
import { render, screen } from '@testing-library/react';
import CalendarCell from './CalendarCell';

describe('CalendarCell', () => {
  it('renders the date and handles basic props', () => {
    const mockDay: import('@/types/market-data').CalendarDay = {
  date: '2025-07-25',
  dayNumber: 25,
  isCurrentMonth: true,
  isToday: false,
  isSelected: true,
  volatilityLevel: 'high',
  performance: 0,
  volume: 1000,
};
render(<CalendarCell day={mockDay} onDateSelect={jest.fn()} index={0} />);
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('applies correct class for selected cell', () => {
    const mockDay: import('@/types/market-data').CalendarDay = {
  date: '2025-07-25',
  dayNumber: 25,
  isCurrentMonth: true,
  isToday: false,
  isSelected: true,
  volatilityLevel: 'medium',
  performance: 0,
  volume: 1000,
};
const { container } = render(<CalendarCell day={mockDay} onDateSelect={jest.fn()} index={0} />);
    expect(container.firstChild).toHaveClass('selected');
  });

  it('shows correct color for volatility level', () => {
    const mockDay: import('@/types/market-data').CalendarDay = {
  date: '2025-07-25',
  dayNumber: 25,
  isCurrentMonth: true,
  isToday: false,
  isSelected: false,
  volatilityLevel: 'low',
  performance: 0,
  volume: 1000,
};
const { container } = render(<CalendarCell day={mockDay} onDateSelect={jest.fn()} index={0} />);
    expect(container.firstChild).toHaveClass('volatility-low');
  });
});
