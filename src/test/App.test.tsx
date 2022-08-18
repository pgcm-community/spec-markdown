import React from 'react';
import { render, screen } from '@testing-library/react';
import MarkdownEditor from '../editor';

test('renders learn react link', () => {
  render(<MarkdownEditor />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
