import React, { useState } from 'react';
import { UserCircle, LogOut, Pencil, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export function ProfileDropdown({ user, onLogout, onUserUpdate, anchor, onClose }) {
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
  });
  const [saving, setSaving] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleEdit = (field) => {
    setEditingField(field);
    setEditValues({
      name: user?.name || '',
      username: user?.username || '',
      email: user?.email || '',
    });
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValues({
      name: user?.name || '',
      username: user?.username || '',
      email: user?.email || '',
    });
  };

  const handleSave = async (field) => {
    setSaving(true);
    
    try {
      const updateData = { [field]: editValues[field] };
      
      // Apply username validation
      if (field === 'username') {
        updateData.username = updateData.username.toLowerCase().replace(/[^a-z0-9._-]/g, '');
      }

      const response = await fetch(`${API_URL}/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update user in localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsed = JSON.parse(userData);
        localStorage.setItem('user', JSON.stringify({ ...parsed, ...data.user }));
      }

      // Call parent update handler
      if (onUserUpdate) {
        onUserUpdate(data.user);
      }

      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
      setEditingField(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter' && !saving) {
      handleSave(field);
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!anchor) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] bg-transparent" 
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="absolute right-4 top-16 bg-card border border-border rounded-xl shadow-xl w-80 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Profile Header */}
        <div className="p-4 border-b border-border/50 bg-muted/30 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-lg font-bold text-primary-foreground shadow-inner">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {user?.name || 'User'}
              </h3>
              <p className="text-xs text-muted-foreground">Profile</p>
            </div>
          </div>
        </div>

        {/* Profile Details with Inline Editing */}
        <div className="p-4 space-y-4 border-b border-border/50">
          {/* Name */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1.5">
              Name
            </p>
            {editingField === 'name' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editValues.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'name')}
                  disabled={saving}
                  autoFocus
                  className="flex-1 px-2 py-1 text-sm border border-input bg-background rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={() => handleSave('name')}
                  disabled={saving}
                  className="p-1 text-primary hover:bg-primary/10 rounded transition-colors disabled:opacity-50"
                  title="Save"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="p-1 text-muted-foreground hover:bg-accent rounded transition-colors disabled:opacity-50"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between group">
                <p className="text-sm font-medium text-foreground">{user?.name || '-'}</p>
                <button
                  onClick={() => handleEdit('name')}
                  className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors opacity-0 group-hover:opacity-100"
                  title="Edit name"
                >
                  <Pencil size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Username */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1.5">
              Username
            </p>
            {editingField === 'username' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editValues.username}
                  onChange={(e) => handleInputChange('username', e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                  onKeyDown={(e) => handleKeyDown(e, 'username')}
                  disabled={saving}
                  autoFocus
                  className="flex-1 px-2 py-1 text-sm border border-input bg-background rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={() => handleSave('username')}
                  disabled={saving}
                  className="p-1 text-primary hover:bg-primary/10 rounded transition-colors disabled:opacity-50"
                  title="Save"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="p-1 text-muted-foreground hover:bg-accent rounded transition-colors disabled:opacity-50"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between group">
                <p className="text-sm font-medium text-foreground">
                  {user?.username || '-'}
                </p>
                <button
                  onClick={() => handleEdit('username')}
                  className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors opacity-0 group-hover:opacity-100"
                  title="Edit username"
                >
                  <Pencil size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1.5">
              Email
            </p>
            {editingField === 'email' ? (
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={editValues.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'email')}
                  disabled={saving}
                  autoFocus
                  className="flex-1 px-2 py-1 text-sm border border-input bg-background rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={() => handleSave('email')}
                  disabled={saving}
                  className="p-1 text-primary hover:bg-primary/10 rounded transition-colors disabled:opacity-50"
                  title="Save"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="p-1 text-muted-foreground hover:bg-accent rounded transition-colors disabled:opacity-50"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between group">
                <p className="text-sm font-medium text-foreground truncate pr-2">
                  {user?.email || '-'}
                </p>
                <button
                  onClick={() => handleEdit('email')}
                  className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                  title="Edit email"
                >
                  <Pencil size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Menu Actions */}
        <div className="p-2">
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 text-left hover:bg-destructive/10 text-destructive rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
