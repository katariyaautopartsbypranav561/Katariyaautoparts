import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import PageLoader from './PageLoader';
import { DataContext } from '../context/DataContext';

const renderPageLoader = () => {
  return render(
    <DataContext.Provider value={{ frontendSettings: { storeName: 'Katariya Auto Parts' } }}>
      <PageLoader onFinish={() => {}} />
    </DataContext.Provider>
  );
};

test('renders PageLoader correctly', () => {
  renderPageLoader();
  expect(screen.getByText('katariya auto parts')).toBeInTheDocument();
});
