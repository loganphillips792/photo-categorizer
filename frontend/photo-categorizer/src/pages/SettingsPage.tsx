import React, { useState, FormEvent } from 'react';

// Interface for a category
interface Category {
  id: string; // Or number, depending on backend
  name: string;
  description: string;
}

const SettingsPage: React.FC = () => {
  // State for the list of categories (replace with data fetched from backend later)
  const [categories, setCategories] = useState<Category[]>([
    // Example initial categories (remove later)
    { id: 'cat-1', name: 'Work', description: 'Screenshots related to work projects.' },
    { id: 'cat-2', name: 'Personal', description: 'Personal screenshots, memes, etc.' },
  ]);

  // State for the new category form inputs
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [newCategoryDescription, setNewCategoryDescription] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleAddCategory = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(''); // Clear previous errors

    if (!newCategoryName.trim() || !newCategoryDescription.trim()) {
      setError('Category name and description cannot be empty.');
      return;
    }

    // Check for duplicate category names (case-insensitive)
    if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
        setError(`Category "${newCategoryName.trim()}" already exists.`);
        return;
    }

    // TODO: Add API call here to save the category to the backend
    // On success, the backend should return the created category with its real ID

    // Simulate adding category locally (replace with backend logic)
    const newCategory: Category = {
      id: `temp-cat-${Date.now()}`, // Temporary ID
      name: newCategoryName.trim(),
      description: newCategoryDescription.trim(),
    };

    setCategories(prevCategories => [...prevCategories, newCategory]);

    // Clear the form
    setNewCategoryName('');
    setNewCategoryDescription('');
  };

  // TODO: Add functions for editing and deleting categories (including API calls)

  return (
    <div>
      <h1>Settings</h1>

      <h2>Manage Categories</h2>

      {/* Form to add a new category */}
      <form onSubmit={handleAddCategory} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '5px' }}>
        <h3>Add New Category</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="categoryName" style={{ marginRight: '10px' }}>Name:</label>
          <input
            type="text"
            id="categoryName"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="categoryDescription" style={{ marginRight: '10px' }}>Description:</label>
          <textarea
            id="categoryDescription"
            value={newCategoryDescription}
            onChange={(e) => setNewCategoryDescription(e.target.value)}
            required
            rows={3}
            style={{ width: '300px' }} // Basic styling
          />
        </div>
        <button type="submit">Add Category</button>
      </form>

      {/* List of existing categories */}
      <h3>Existing Categories</h3>
      {categories.length === 0 ? (
        <p>No categories defined yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {categories.map((category) => (
            <li key={category.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <strong>{category.name}</strong>: {category.description}
              {/* TODO: Add Edit/Delete buttons here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SettingsPage;