import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UploadField from './UploadField';
import * as imageUploadUtils from '../utils/imageUpload';

vi.mock('../utils/imageUpload', () => ({
  handleImageUpload: vi.fn()
}));

describe('UploadField Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
  });

  it('renders correctly with label and size recommendations', () => {
    render(
      <UploadField 
        label="Test Upload"
        recommendedSize="800x800px"
        maxSize="2MB"
        formats="JPG, PNG"
        value=""
        onChange={() => {}}
      />
    );
    expect(screen.getByText('Test Upload')).toBeInTheDocument();
    // There's an amber info box — just check body text contains our values
    expect(document.body.textContent).toContain('800x800px');
    expect(document.body.textContent).toContain('JPG, PNG');
    expect(screen.getByText('Click to upload or drag and drop')).toBeInTheDocument();
  });

  it('shows max size in recommendation panel', () => {
    render(<UploadField maxSize="5MB" onChange={() => {}} />);
    // Multiple elements may contain "5MB" — just check body text
    expect(document.body.textContent).toContain('5MB');
  });

  it('displays image preview when value is provided', () => {
    render(
      <UploadField 
        value="https://example.com/image.jpg"
        onChange={() => {}}
      />
    );
    const img = screen.getByAltText('Preview');
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('hides upload prompt when value is provided', () => {
    render(
      <UploadField 
        value="https://example.com/image.jpg"
        onChange={() => {}}
      />
    );
    expect(screen.queryByText('Click to upload or drag and drop')).not.toBeInTheDocument();
  });

  it('shows Replace and Remove buttons on hover state for existing media', () => {
    render(
      <UploadField 
        value="https://example.com/image.jpg"
        onChange={() => {}}
      />
    );
    expect(screen.getByText('Replace')).toBeInTheDocument();
    expect(screen.getByTitle('Remove media')).toBeInTheDocument();
  });

  it('calls onChange with empty string when Remove is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <UploadField 
        value="https://example.com/image.jpg"
        onChange={handleChange}
      />
    );
    await user.click(screen.getByTitle('Remove media'));
    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('shows video tag for isVideo prop', () => {
    render(
      <UploadField 
        value="https://example.com/video.mp4"
        isVideo={true}
        onChange={() => {}}
      />
    );
    // video element should be rendered
    expect(document.querySelector('video')).toBeTruthy();
  });

  it('shows correct accept types for video mode', () => {
    render(<UploadField isVideo={true} onChange={() => {}} />);
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toHaveAttribute('accept', 'video/mp4,video/webm');
  });

  it('shows correct accept types for image mode (default)', () => {
    render(<UploadField onChange={() => {}} />);
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toHaveAttribute('accept', 'image/jpeg,image/png,image/webp');
  });
});
