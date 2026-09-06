import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DataProvider, useData } from './DataContext';

function TestComponent() {
  const { products, setProducts, categories, setCategories, slides, setSlides, deals, setDeals } = useData();

  return (
    <div>
      <div data-testid="product-count">{products.length}</div>
      <div data-testid="category-count">{categories.length}</div>
      <div data-testid="slide-count">{slides.length}</div>
      <div data-testid="deal-count">{deals.length}</div>
      
      <button 
        data-testid="add-product-btn" 
        onClick={() => setProducts([...products, { id: 999, name: 'Test Product' }])}
      >
        Add Product
      </button>
      <button 
        data-testid="add-category-btn" 
        onClick={() => setCategories([...categories, { id: 999, label: 'Test Category' }])}
      >
        Add Category
      </button>
      <button 
        data-testid="add-slide-btn" 
        onClick={() => setSlides([...slides, { id: 999, tag: 'Test Slide' }])}
      >
        Add Slide
      </button>
      <button 
        data-testid="add-deal-btn" 
        onClick={() => setDeals([...deals, { id: 999, title: 'Test Deal' }])}
      >
        Add Deal
      </button>
    </div>
  );
}

describe('DataContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('provides initial data context state', () => {
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    expect(screen.getByTestId('product-count')).toBeInTheDocument();
    expect(screen.getByTestId('category-count')).toBeInTheDocument();
  });

  it('updates state on setProducts', () => {
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    act(() => {
      screen.getByTestId('add-product-btn').click();
    });

    expect(screen.getByTestId('product-count').textContent).toBe('1');
  });

  it('updates state on setCategories', () => {
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    act(() => {
      screen.getByTestId('add-category-btn').click();
    });

    expect(screen.getByTestId('category-count').textContent).toBe('1');
  });

  it('updates state on setSlides', () => {
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    act(() => {
      screen.getByTestId('add-slide-btn').click();
    });

    expect(screen.getByTestId('slide-count').textContent).toBe('1');
  });

  it('updates state on setDeals', () => {
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    act(() => {
      screen.getByTestId('add-deal-btn').click();
    });

    expect(screen.getByTestId('deal-count').textContent).toBe('1');
  });

  it('throws an error if useData is used outside DataProvider', () => {
    const originalError = console.error;
    console.error = () => {};
    
    expect(() => render(<TestComponent />)).toThrow('useData must be used within DataProvider');
    
    console.error = originalError;
  });
});
