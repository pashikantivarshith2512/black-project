'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';
import { fetchApi } from '@/services/api';
import { MenuItem } from '@/types';

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(400);
  const [categoryName, setCategoryName] = useState('COFFEE');
  const [availability, setAvailability] = useState(true);
  const [isSpecialty, setIsSpecialty] = useState(false);
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadMenu = async () => {
    setLoading(true);
    const res = await fetchApi('/menu');
    if (res.success && res.data?.items) {
      setItems(res.data.items);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setPrice(400);
    setCategoryName('COFFEE');
    setAvailability(true);
    setIsSpecialty(false);
    setImage('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80');
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    setCategoryName(item.category?.name || 'COFFEE');
    setAvailability(item.availability);
    setIsSpecialty(item.isSpecialty);
    setImage(item.image);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    const res = await fetchApi(`/menu/${id}`, { method: 'DELETE' });
    if (res.success) {
      loadMenu();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name,
      description,
      price: Number(price),
      categoryName,
      availability,
      isSpecialty,
      image,
    };

    let res;
    if (editingItem) {
      res = await fetchApi(`/menu/${editingItem.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetchApi('/menu', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    }

    if (res.success) {
      setIsModalOpen(false);
      loadMenu();
    } else {
      alert(res.message || 'Operation failed');
    }
    setSubmitting(false);
  };

  const filteredItems = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-3 text-ikigai-cream/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full bg-espresso-800 border border-ikigai-border rounded-xl pl-9 pr-4 py-2 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
          />
        </div>

        <button
          onClick={openCreateModal}
          className="gold-gradient-btn px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 w-full sm:w-auto justify-center"
        >
          <Plus size={16} />
          <span>Add New Menu Item</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-ikigai-gold border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ikigai-border bg-espresso-800/60">
          <table className="w-full text-left text-xs text-ikigai-cream">
            <thead className="bg-espresso-950 text-ikigai-gold uppercase font-serif border-b border-ikigai-border">
              <tr>
                <th className="p-4">Item</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ikigai-border/60">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-espresso-700/40">
                  <td className="p-4 flex items-center space-x-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover" />
                    <div>
                      <div className="font-bold text-ikigai-cream">{item.name}</div>
                      <div className="text-[10px] text-ikigai-cream/50 truncate max-w-xs">{item.description}</div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-ikigai-cream/80">{item.category?.name}</td>
                  <td className="p-4 font-bold text-ikigai-gold">₹{item.price}</td>
                  <td className="p-4">
                    {item.availability ? (
                      <span className="text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                        Available
                      </span>
                    ) : (
                      <span className="text-red-400 font-semibold bg-red-950/60 px-2 py-0.5 rounded border border-red-500/20">
                        Sold Out
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded border border-ikigai-border text-ikigai-gold hover:bg-ikigai-gold/10"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded border border-red-500/30 text-red-400 hover:bg-red-950/40"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-espresso-900 border border-ikigai-gold/40 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-ikigai-border pb-3">
              <h3 className="font-serif text-lg font-bold text-ikigai-gold">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-ikigai-cream/50 text-lg">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-ikigai-cream/70">Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-espresso-800 border border-ikigai-border rounded-xl p-2.5 text-ikigai-cream"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-ikigai-cream/70">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-espresso-800 border border-ikigai-border rounded-xl p-2.5 text-ikigai-cream"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-ikigai-cream/70">Category *</label>
                <select
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full bg-espresso-800 border border-ikigai-border rounded-xl p-2.5 text-ikigai-cream"
                >
                  <option value="COFFEE">COFFEE</option>
                  <option value="FOOD">FOOD</option>
                  <option value="DESSERTS">DESSERTS</option>
                  <option value="DRINKS">DRINKS</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-ikigai-cream/70">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-espresso-800 border border-ikigai-border rounded-xl p-2.5 text-ikigai-cream"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ikigai-cream/70">Image URL *</label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-espresso-800 border border-ikigai-border rounded-xl p-2.5 text-ikigai-cream"
                />
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availability}
                    onChange={(e) => setAvailability(e.target.checked)}
                    className="rounded bg-espresso-800 border-ikigai-border"
                  />
                  <span>In Stock / Available</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSpecialty}
                    onChange={(e) => setIsSpecialty(e.target.checked)}
                    className="rounded bg-espresso-800 border-ikigai-border"
                  />
                  <span>Chef's Specialty</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="gold-gradient-btn w-full py-3 rounded-xl font-bold shadow-lg"
              >
                {submitting ? 'Saving...' : 'Save Item'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
