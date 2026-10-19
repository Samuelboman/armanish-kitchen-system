import { useState } from "react";
import { Pencil, Plus, RefreshCw, Trash2, UtensilsCrossed } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Pill from "../../components/ui/Pill";
import Switch from "../../components/ui/Switch";
import Dialog from "../../components/ui/Dialog";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import StatusMessage from "../../components/ui/StatusMessage";
import FoodImage from "../../components/ui/FoodImage";
import MenuItemForm from "../../components/admin/MenuItemForm";
import NoticeBar from "../../components/admin/NoticeBar";
import { useAdminList } from "../../hooks/useAdminList";
import { useNotice } from "../../hooks/useNotice";
import { useAuth } from "../../context/auth-context";
import { usePageTitle } from "../../hooks/usePageTitle";
import { apiFetch } from "../../lib/api";
import { formatNaira } from "../../lib/format";
import { CATEGORIES, categoryLabel } from "../../config/menu";

const categoryOrder = (value) => CATEGORIES.findIndex((c) => c.value === value);

// The public menu already includes unavailable items.
const loadMenu = (signal) => apiFetch("/api/menu", { signal }).then((result) => result.data);

// Menu management: every item (available or not), add, edit, delete, availability.
export default function AdminMenuPage() {
  usePageTitle("Admin: menu");
  const { authFetch } = useAuth();
  const { items, setItems, status, reload } = useAdminList(loadMenu);
  const [editing, setEditing] = useState(null); // null | "new" | item
  const [deleting, setDeleting] = useState(null); // item
  const [notice, setNotice] = useNotice();

  const sorted = [...items].sort((a, b) => categoryOrder(a.category) - categoryOrder(b.category));

  const toggleAvailable = async (item, available) => {
    setItems((list) => list.map((i) => (i._id === item._id ? { ...i, available } : i)));
    try {
      await authFetch(`/api/menu/${item._id}`, { method: "PUT", body: { available } });
      setNotice({ text: `${item.name} is now ${available ? "available" : "not available"}.` });
    } catch (error) {
      setItems((list) => list.map((i) => (i._id === item._id ? { ...i, available: !available } : i)));
      setNotice({ text: `Couldn't update ${item.name}: ${error.message}`, tone: "error" });
    }
  };

  const handleSaved = (saved) => {
    setItems((list) => (list.some((i) => i._id === saved._id) ? list.map((i) => (i._id === saved._id ? saved : i)) : [...list, saved]));
    setNotice({ text: editing === "new" ? `Added ${saved.name}.` : `Saved ${saved.name}.` });
    setEditing(null);
  };

  const handleDelete = async () => {
    await authFetch(`/api/menu/${deleting._id}`, { method: "DELETE" });
    setItems((list) => list.filter((i) => i._id !== deleting._id));
    setNotice({ text: `Deleted ${deleting.name}.` });
  };

  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="display-heading text-2xl sm:text-3xl">Menu</h1>
          <p className="text-muted">Prices, units and photos here are what customers see.</p>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus className="size-5" aria-hidden="true" /> Add item
        </Button>
      </div>

      <NoticeBar notice={notice} />

      {status === "loading" && (
        <p role="status" className="py-10 text-center text-muted">
          Loading the menu
        </p>
      )}
      {status === "error" && (
        <Card>
          <StatusMessage
            tone="error"
            icon={RefreshCw}
            title="We couldn't load the menu"
            actions={<Button onClick={reload}>Try again</Button>}
          />
        </Card>
      )}
      {status === "ready" && items.length === 0 && (
        <Card>
          <StatusMessage
            icon={UtensilsCrossed}
            title="No menu items yet"
            actions={<Button onClick={() => setEditing("new")}>Add the first item</Button>}
          >
            Customers will see &quot;The menu is being updated&quot; until you add items.
          </StatusMessage>
        </Card>
      )}

      {status === "ready" && items.length > 0 && (
        <ul className="space-y-3">
          {sorted.map((item) => (
            <li key={item._id}>
              <Card className="flex flex-wrap items-center gap-x-4 gap-y-3 p-3 sm:p-4">
                <FoodImage src={item.image} alt="" className="size-16 shrink-0 rounded-xl" unavailable={!item.available} />
                <div className="min-w-0 flex-1">
                  <p className="font-display font-bold">
                    {item.name}
                    {!item.available && (
                      <Pill tone="subtle" className="ml-2 align-middle">
                        Not available
                      </Pill>
                    )}
                  </p>
                  <p className="text-sm text-muted">
                    {categoryLabel(item.category)} · {formatNaira(item.price)}
                    {item.unit ? ` · ${item.unit}` : ""}
                  </p>
                  {item.accompaniments?.length > 0 && (
                    <p className="text-sm text-muted">Options: {item.accompaniments.join(", ")}</p>
                  )}
                  {!item.description && <p className="text-sm text-muted italic">No description yet</p>}
                </div>
                <div className="flex w-full items-center justify-between gap-2 sm:w-auto">
                  <Switch
                    checked={item.available}
                    onChange={(available) => toggleAvailable(item, available)}
                    label={`Available: ${item.name}`}
                    hideLabel
                  />
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditing(item)}>
                      <Pencil className="size-4" aria-hidden="true" /> Edit
                      <span className="sr-only"> {item.name}</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleting(item)} className="text-red">
                      <Trash2 className="size-4" aria-hidden="true" /> Delete
                      <span className="sr-only"> {item.name}</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "Add menu item" : `Edit ${editing?.name ?? ""}`}
      >
        <MenuItemForm item={editing === "new" ? null : editing} onSaved={handleSaved} onCancel={() => setEditing(null)} />
      </Dialog>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title={`Delete ${deleting?.name ?? ""}?`}
        confirmLabel="Delete item"
        onConfirm={handleDelete}
      >
        It will disappear from the menu. This can&apos;t be undone. Past orders keep their details. To hide it
        for a while instead, switch off &quot;Available&quot;.
      </ConfirmDialog>
    </>
  );
}
