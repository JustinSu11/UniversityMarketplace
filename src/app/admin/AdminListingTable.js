'use client';

import { useState, useTransition } from 'react';

export default function AdminListingTable({ initialListings }) {
  const [rows, setRows] = useState(initialListings || []);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState(null);

  async function deleteListing(id) {
    if (!confirm('Delete this listing?')) return;
    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin', // be explicit
      });

      if (res.ok) {
        startTransition(() => {
          setRows(prev => prev.filter(x => x.id !== id));
        });
        return;
      }

      // Build a useful error message
      let msg = `Delete failed (HTTP ${res.status})`;
      try {
        const body = await res.json();
        if (body?.error) msg += `: ${body.error}`;
        if (body?.code) msg += ` [${body.code}]`;
      } catch {
        // no json body
      }
      alert(msg);
      console.error('DELETE /api/admin/listings/:id failed', res);
    } catch (err) {
      alert('Network error while deleting. Is the dev server running?');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  }

  if (!rows.length) return <p>No listings.</p>;

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left border-b">
          <th className="py-2">ID</th>
          <th>Title</th>
          <th>Seller</th>
          <th>Created</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rows.map(l => {
          const isThisDeleting = deletingId === l.id;
          return (
            <tr key={l.id} className="border-b opacity-100">
              <td className="py-2">{l.id}</td>
              <td className="pr-4">{l.title}</td>
              <td className="pr-4">{l.seller?.email ?? '—'}</td>
              <td className="pr-4">{new Date(l.createdAt).toLocaleString()}</td>
              <td className="text-right">
                <button
                  className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-60"
                  disabled={isPending || isThisDeleting}
                  onClick={() => deleteListing(l.id)}
                  title="Delete listing"
                >
                  {isThisDeleting ? 'Deleting…' : 'Delete'}
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
