import React from 'react'
import { render, screen } from '@testing-library/react'
import MarkdownEditor from '../editor'

test('renders learn react link', () => {
  const linkElement = screen.getByText(/learn react/i)
})
